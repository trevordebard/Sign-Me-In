import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import io from 'socket.io-client';
import Layout from '../components/Layout';
import Box from '../components/Box';
import Divider from '../components/global-styles/Divider';

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
function room({ roomCode, users }) {
  const [userObjects, setUserObjects] = useState(users);
  const namesContainer = useRef(null);
  const { current: socket } = useRef(io());

  useEffect(() => {
    try {
      socket.open();
      socket.emit('join-room', roomCode);
      socket.on('add-user', data => {
        setUserObjects(objs => [...objs, data.user]);
      });
    } catch (error) {
      console.log(error);
    }
    // Return a callback to be run before unmount-ing.
    return () => {
      socket.close();
    };
  }, []);

  // This will be used when a new user joins the room
  const scrollToBottom = () => {
    namesContainer.current.scrollTop = namesContainer.current.scrollHeight;
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
          {userObjects.map(user => (
            <Name>{user.display_name}</Name>
          ))}
          <Anchor />
        </NamesContainer>
      </RoomBox>
    </Layout>
  );
}

room.getInitialProps = async ({ query, req, res }) => {
  const { roomCode, apiUrl } = query;
  try {
    const response = await axios.get(`${apiUrl}/room/${roomCode}`);
    if (
      response.data.status === 'KNOWN' &&
      response.data.reason === 'roomDoesNotExist'
    ) {
      return res.redirect('/notfound?reason=roomDoesNotExist');
    }
    return { roomCode, users: response.data.payload };
  } catch (err) {
    console.log(err);
    return res.redirect('/');
  }
};

room.propTypes = {
  roomCode: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default room;
