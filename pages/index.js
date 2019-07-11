import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Router from 'next/router';
import styled from 'styled-components';
import getConfig from 'next/config';
import Layout from '../components/Layout';
import Box from '../components/Box';
import Divider from '../components/global-styles/Divider';
import StyledButton from '../components/global-styles/StyledButton';
import StyledFontAwesomeIcon from '../components/global-styles/StyledFontAwesomeIcon';
import StyledInput from '../components/global-styles/StyledInput';
import DividerWithText from '../components/global-styles/DividerWithText';
import ErrorText from '../components/global-styles/ErrorText';

const { publicRuntimeConfig } = getConfig();
const apiUrl = publicRuntimeConfig.API_URL;

const Logo = styled.img`
  width: 180px;
  height: auto;
`;

const RoomCodeInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    flex: 1;
    padding: 15px;
    font-size: 16px;
  }
  svg {
    font-size: 3rem;
    margin-left: 5px;
  }
`;
const Content = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  margin: 20px 0px;
`;

const Index = props => {
  const [roomInput, setRoomeInput] = useState('');
  const [error, setError] = useState(null);

  const handleJoinClick = async e => {
    if (!roomInput) {
      e.preventDefault();
      setError('Room code cannot be empty.');
    } else {
      try {
        const roomInfo = await getRoomInfo();
        if (roomInfo.roomExists) {
          // Right now I cannot find a way to pass fields in the route without it showing up in url
          // Future implementation should pass this data to /join
          Router.push({
            pathname: `/join/${roomInput}`,
          });
        } else if (roomInfo.error) {
          console.log('there was an error getting room info');
          console.log(roomInfo.error);
        } else if (roomInfo.roomExists === false) {
          setError('That room does not exist.');
        } else {
          console.log(roomInfo);
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    }
  };
  // If the enter/return key is pressed
  const checkForEnterKey = e => {
    if (e.keyCode === 13) {
      handleJoinClick(e);
    }
  };

  const getRoomInfo = async () => {
    try {
      const response = await axios.get(`${apiUrl}/fields/${roomInput}`);
      if (response.data.status === 'KNOWN') {
        if (response.data.reason === 'roomDoesNotExist') {
          return { roomExists: false };
        }
        if (response.data.reason === 'connectionRefused') {
          setError('There was a problem connecting to the database');
          return {
            error: response.data.payload.error,
            message: response.data.payload.message,
          };
        }
      }
      return {
        roomExists: true,
        fields: response.data.payload,
        userApi: `${apiUrl}/user`,
      };
    } catch (err) {
      return { roomExists: false, error: err };
    }
  };
  return (
    <Layout>
      <Box>
        <Logo src="/static/images/SMI_logo.png" alt="Sign Me In"></Logo>
        <Divider />
        <Content>
          <Link href="/generate">
            <StyledButton>Generate Room</StyledButton>
          </Link>
          <DividerWithText>or</DividerWithText>
          <RoomCodeInput>
            <StyledInput
              placeholder="Enter room code"
              onKeyDown={checkForEnterKey}
              onChange={e => {
                setError(null);
                setRoomeInput(e.target.value.toUpperCase());
              }}
              value={roomInput}
            ></StyledInput>
            <StyledFontAwesomeIcon
              icon="angle-right"
              width="0"
              onClick={handleJoinClick}
            />
          </RoomCodeInput>
          {error && <ErrorText>{error}</ErrorText>}
        </Content>
      </Box>
    </Layout>
  );
};
export default Index;
