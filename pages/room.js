import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import io from 'socket.io-client';
import getConfig from 'next/config';
import Layout from '../components/Layout';
import Box from '../components/Box';
import Divider from '../components/global-styles/Divider';
import ErrorText from '../components/global-styles/ErrorText';
import StyledButton from '../components/global-styles/StyledButton';
import generateCSV from '../utils/generateCSV';

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
  const [userObjects, setUserObjects] = useState(users);
  const [errorMessage, setErrorMessage] = useState(message);
  const namesContainer = useRef(null);
  const { current: socket } = useRef(io(publicRuntimeConfig.SOCKET_URL));

  useEffect(() => {
    try {
      socket.open();
      socket.emit('join-room', roomCode);
      socket.on('add-user', data => {
        setUserObjects(objs => [...objs, data.user]);
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
        <Divider />
        <NamesContainer ref={namesContainer}>
          {userObjects &&
            userObjects.map(user => (
              <Name
                key={`${Math.random()
                  .toString(36)
                  .substring(7)}_${user.display_name}`}
              >
                {user.display_name}
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

room.getInitialProps = async ({ query, req, res }) => {
  const { roomCode, apiUrl } = query;
  try {
    const response = await axios.get(`${apiUrl}/room/${roomCode}`);
    console.log(response);
    if (response.data.status === 'KNOWN') {
      if (response.data.reason === 'roomDoesNotExist') {
        return res.redirect('/notfound?reason=roomDoesNotExist');
      }
      if (response.data.reason === 'connectionRefused') {
        console.log('refused');
        return {
          error: response.data.payload.error,
          message: response.data.payload.message,
          roomCode,
        };
      }
    } else if (response.data.status === 'SUCCESS') {
      console.log('success...');
      return { roomCode, users: response.data.payload };
    } else {
      console.log('unkown');
      return { error: true, message: 'An unknown error occured', roomCode };
    }
  } catch (err) {
    console.log(err);
    return res.redirect('/');
  }
};

room.propTypes = {
  roomCode: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.object),
};
room.defaultProps = {
  users: [],
};
export default room;
