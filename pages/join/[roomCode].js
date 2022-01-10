import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import createPersistedState from 'use-persisted-state';
import io from 'socket.io-client';
import getConfig from 'next/config';
import * as api from '../../lib/api';
import Layout from '../../components/Layout';
import Box from '../../components/Box';
import StyledInput from '../../components/global-styles/StyledInput';
import StyledButton from '../../components/global-styles/StyledButton';
import DividerWithText from '../../components/global-styles/DividerWithText';
import ErrorText from '../../components/global-styles/ErrorText';

const { publicRuntimeConfig } = getConfig();

const useSumbittedState = createPersistedState('submitted');

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 85%;
  margin: auto 20px;
  div {
    flex-direction: column;
    display: flex;
  }
  input {
    margin: 1rem 0;
    flex: 1;
  }
  a {
    align-self: center;
    color: dodgerblue;
    text-decoration: none;
    font-size: 1.4rem;
  }
  h1 {
    align-self: center;
  }
`;

const Join = ({ message, fields }) => {
  const router = useRouter();
  const { roomCode } = router.query;
  const [errorMessage, setErrorMessage] = useState(message);
  const form = useRef();
  const [submitted, setSubmitted] = useSumbittedState({ [roomCode]: false });
  const handleSubmit = async e => {
    e.preventDefault();
    const user = {};
    const { children } = form.current;
    let allowSubmit = true;
    Array.prototype.forEach.call(children, field => {
      if (field.id.toLowerCase() === 'first name') {
        user.first_name = field.value;
      } else if (field.id.toLowerCase() === 'last name') {
        user.last_name = field.value;
      } else {
        // user[field.id] = field.value;
        user.data = { ...user.data, [field.id]: field.value };
      }
      if (field.value === '') {
        allowSubmit = false;
      }
    });
    if (allowSubmit) {
      const response = await api.addUser({ ...user, roomCode });
      if (response.status === 'SUCCESS') {
        setSubmitted({ ...submitted, [roomCode]: true });
        const socket = io(publicRuntimeConfig.SOCKET_URL);
        socket.emit('new-user', {
          ...user,
          display_name: `${user.first_name} ${user.last_name}`,
          room_code: roomCode,
          roomCode,
        });
      } else if (response.status === 'KNOWN') {
        setErrorMessage(response.message);
      } else {
        setErrorMessage(response.message);
      }
    } else {
      // one or more fields is empty
      setErrorMessage('One or more fields are empty');
    }
  };
  const renderForm = () => (
    <div>
      <div ref={form}>
        {fields &&
          fields.map(field => (
            <StyledInput
              id={field}
              key={`${roomCode}_${field}_${new Date()}`}
              placeholder={field}
            />
          ))}
      </div>
      <StyledButton onClick={e => handleSubmit(e)}>Submit</StyledButton>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      <DividerWithText>or</DividerWithText>
      <Link href="/room/[roomCode]" as={`/room/${roomCode}`}>
        View Room Users
      </Link>
    </div>
  );
  const renderSubmitted = () => (
    <>
      <h1>Submitted!</h1>
      <Link href="/room/[roomCode]" as={`/room/${roomCode}`}>
        Visit Room
      </Link>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </>
  );
  return (
    <Layout>
      <Box>
        <InputContainer>
          {submitted[roomCode] && renderSubmitted()}
          {!submitted[roomCode] && renderForm()}
        </InputContainer>
      </Box>
    </Layout>
  );
};

export const getServerSideProps = async context => {
  const { roomCode } = context.query;
  try {
    const response = await api.getRoomInfo(roomCode);
    if (response.roomExists) {
      return {
        props: response,
      };
    }
    if (response.reason === 'roomDoesNotExist') {
      return {
        redirect: {
          permanent: false,
          destination: '/notfound?reason=roomDoesNotExist',
        },
      };
    }
    if (response.reason === 'connectionRefused') {
      return {
        redirect: {
          permanent: false,
          destination: '/notfound?reason=connectionRefused',
        },
      };
    }
    return {
      redirect: {
        permanent: false,
        destination: '/?error=true',
      },
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/?error=true',
      },
    };
  }
};

// Join.getInitialProps = async ({ query, res }) => {

// };

export default Join;
