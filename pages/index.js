import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Box from '../components/Box';
import Divider from '../components/global-styles/Divider';
import StyledButton from '../components/global-styles/StyledButton';
import StyledFontAwesomeIcon from '../components/global-styles/StyledFontAwesomeIcon';

const Logo = styled.img`
  width: 180px;
  height: auto;
`;
const DividerWithText = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: hsl(0, 0%, 80%);
  text-transform: uppercase;

  :before,
  :after {
    content: '';
    border-top: 1px solid hsl(0, 0%, 80%);
    margin: 0 20px 0 0;
    flex: 1 0 20px;
  }

  :after {
    margin: 0 0 0 20px;
  }
`;
const RoomCodeInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    flex: 1;
    background: #f2f2f2;
    border: 0;
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
            <input type="text" placeholder="Enter room code"></input>
            <StyledFontAwesomeIcon icon="angle-right" />
          </RoomCodeInput>
        </Content>
      </Box>
    </Layout>
  );
};
export default Index;
