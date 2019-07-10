import React, { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Box from '../components/Box';
import Divider from '../components/global-styles/Divider';
import StyledButton from '../components/global-styles/StyledButton';
import StyledFontAwesomeIcon from '../components/global-styles/StyledFontAwesomeIcon';
import StyledInput from '../components/global-styles/StyledInput';
import DividerWithText from '../components/global-styles/DividerWithText';

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

  const handleJoinClick = e => {
    if (!roomInput) {
      e.preventDefault();
    } else {
      Router.push(`/join/${roomInput}`);
    }
  };
  // If the enter/return key is pressed
  const checkForEnterKey = e => {
    if (e.keyCode === 13) {
      handleJoinClick(e);
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
              onChange={e => setRoomeInput(e.target.value.toUpperCase())}
              value={roomInput}
            ></StyledInput>
            <StyledFontAwesomeIcon
              icon="angle-right"
              onClick={handleJoinClick}
            />
          </RoomCodeInput>
        </Content>
      </Box>
    </Layout>
  );
};
export default Index;
