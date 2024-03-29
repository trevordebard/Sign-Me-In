import React, { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import Image from 'next/image';
import Layout from '../components/Layout';
import Box from '../components/Box';
import StyledButton from '../components/global-styles/StyledButton';
import StyledFontAwesomeIcon from '../components/global-styles/StyledFontAwesomeIcon';
import StyledInput from '../components/global-styles/StyledInput';
import DividerWithText from '../components/global-styles/DividerWithText';
import ErrorText from '../components/global-styles/ErrorText';
import * as api from '../lib/api';

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

const Index = () => {
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
          Router.push(`/join/[roomCode]`, `/join/${roomInput}`);
        } else if (roomInfo.error && roomInfo.reason === 'connectionRefused') {
          setError(roomInfo.message);
        } else if (roomInfo && roomInfo.roomExists === false) {
          setError('That room does not exist.');
        } else {
          setError('An unknown error occurred.');
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
    const response = await api.getRoomInfo(roomInput);
    return response;
  };
  return (
    <Layout>
      <Box>
        <Image
          src="/images/SMI_logo.png"
          alt="Sign Me In"
          width="180"
          height="50"
        />
        {/* <Logo src="/images/SMI_logo.png" alt="Sign Me In" /> */}
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
            />
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
