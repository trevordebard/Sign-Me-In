import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import io from 'socket.io-client';
import getConfig from 'next/config';
import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';
import Box from '../../components/Box';
import ErrorText from '../../components/global-styles/ErrorText';
import StyledButton from '../../components/global-styles/StyledButton';
import generateCSV from '../../utils/generateCSV';
import * as api from '../../lib/api';
import { users as iUsers } from '.prisma/client';

const { publicRuntimeConfig } = getConfig();
const RoomBox = styled(Box)`
  max-width: 80vw;
  height: auto;
  max-height: 80vh;
  padding: 2rem;
`;
const NamesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  p {
    color: ${props => props.theme.font};
    :nth-child(odd) {
      color: ${props => props.theme.font_light};
    }
  }
  overflow: auto;
`;
const Header = styled.div`
  text-align: center;
  h1,
  p {
    font-size: 4rem;
    display: inline;
  }
  h1 {
    color: ${props => props.theme.red};
  }
`;

const Name = styled.p`
  margin: 10px 5px;
  font-weight: 500;
  min-width: 140px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 15px;
`;

const Anchor = styled.div``;
function room({ roomCode, users, message }) {
  console.log(users);
  const [userObjects, setUserObjects] = useState<iUsers[]>(users);
  const [errorMessage] = useState(message);
  const namesContainer = useRef(null);
  // @ts-ignore
  const { current: socket } = useRef(io(publicRuntimeConfig.SOCKET_URL));

  useEffect(() => {
    try {
      socket.open();
      socket.emit('join-room', roomCode);
      socket.on('add-user', data => {
        setUserObjects(objs => [...objs, data.user]);
        scrollToBottom();
      });
    } catch (e) {
      console.log(e);
    }
    // Return a callback to be run before unmount-ing.
    return () => {
      socket.close();
    };
  }, []);

  const scrollToBottom = () => {
    namesContainer.current.scrollTop = namesContainer.current.scrollHeight;
  };

  const handleDownload = () => {
    generateCSV(userObjects);
  };

  return (
    <Layout>
      <RoomBox>
        <Header>
          <p>Room Code: </p>
          <h1>{roomCode}</h1>
        </Header>
        <NamesContainer ref={namesContainer}>
          {userObjects.length > 0 &&
            userObjects.map(user => (
              <Name key={user.id}>
                {`${user.first_name} ${user.last_name}`}
              </Name>
            ))}
          <Anchor />
        </NamesContainer>
        {userObjects.length > 0 && (
          <StyledButton onClick={handleDownload}>Download</StyledButton>
        )}
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </RoomBox>
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async context => {
  const { roomCode } = context.query;
  const res = await api.getUsers(roomCode);
  return {
    props: {
      users: res.users,
      roomCode,
    },
  };
};

room.propTypes = {
  roomCode: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.object),
};
room.defaultProps = {
  users: [],
};
export default room;
