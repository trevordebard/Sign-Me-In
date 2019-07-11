/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import createPersistedState from 'use-persisted-state';
import io from 'socket.io-client';
import getConfig from 'next/config';
import Layout from '../components/Layout';
import Box from '../components/Box';
import StyledInput from '../components/global-styles/StyledInput';
import StyledButton from '../components/global-styles/StyledButton';
import DividerWithText from '../components/global-styles/DividerWithText';
import ErrorText from '../components/global-styles/ErrorText';

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

function join({ fields, roomCode, userApi, message }) {
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
        user[field.id] = field.value;
      }
      if (field.value === '') {
        allowSubmit = false;
      }
    });
    if (allowSubmit) {
      const response = await axios.post(userApi, { ...user, roomCode });
      if (response.data.status === 'SUCCESS') {
        setSubmitted({ ...submitted, [roomCode]: true });
        const socket = io(publicRuntimeConfig.SOCKET_URL);
        socket.emit('new-user', {
          ...user,
          display_name: `${user.first_name} ${user.last_name}`,
          roomCode,
        });
      } else if (response.data.status === 'KNOWN') {
        setErrorMessage(
          `Error: ${response.data.reason}. You may refresh the page and try again. Contact support if the problem persists.`
        );
      } else if (response.data.status === 'UNKNOWN') {
        setErrorMessage(
          'An unknown error has occurred. Contact support if the problem persists.'
        );
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
      <Link href={`/room/${roomCode}`}>
        <a>View Room Users</a>
      </Link>
    </div>
  );
  const renderSubmitted = () => (
    <React.Fragment>
      <h1>Submitted!</h1>
      <Link href={`/room/${roomCode}`}>
        <a>Visit Room</a>
      </Link>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </React.Fragment>
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
}

join.propTypes = {};
join.getInitialProps = async ({ query, req, res }) => {
  const { roomCode, apiUrl } = query;
  try {
    const response = await axios.get(`${apiUrl}/fields/${roomCode}`);
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
    }
    return {
      roomCode,
      fields: response.data.payload,
      userApi: `${apiUrl}/user`,
    };
  } catch (err) {
    return res.redirect('/');
  }
};

join.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string),
  roomCode: PropTypes.string.isRequired,
  userApi: PropTypes.string.isRequired,
};
join.defaultProps = {
  fields: [],
};
export default join;
