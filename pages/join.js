/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import createPersistedState from 'use-persisted-state';
import io from 'socket.io-client';
import Layout from '../components/Layout';
import Box from '../components/Box';
import StyledInput from '../components/global-styles/StyledInput';
import StyledButton from '../components/global-styles/StyledButton';
import DividerWithText from '../components/global-styles/DividerWithText';

const useSumbittedState = createPersistedState('submitted');

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 85%;
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

function join({ fields, roomCode, userApi }) {
  const form = useRef();
  const [submitted, setSubmitted] = useSumbittedState({ [roomCode]: false });
  const handleSubmit = async e => {
    e.preventDefault();
    const user = {};
    const { children } = form.current;
    Array.prototype.forEach.call(children, field => {
      if (field.id.toLowerCase() === 'first name') {
        user.first_name = field.value;
      } else if (field.id.toLowerCase() === 'last name') {
        user.last_name = field.value;
      } else {
        user.data = { ...user.data, [field.id]: field.value };
      }
    });
    const response = await axios.post(userApi, { ...user, roomCode });
    if (response.data.status === 'SUCCESS') {
      setSubmitted({ ...submitted, [roomCode]: true });
      const socket = io();
      socket.emit('new-user', {
        ...user,
        display_name: `${user.first_name} ${user.last_name}`,
        roomCode,
      });
      console.log('client: emit new user');
    }
  };
  const renderForm = () => (
    <div>
      <div ref={form}>
        {fields.map(field => (
          <StyledInput
            id={field}
            key={`${roomCode}_${field}_${new Date()}`}
            placeholder={field}
          />
        ))}
      </div>
      <StyledButton onClick={e => handleSubmit(e)}>Submit</StyledButton>
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
    if (
      response.data.status === 'KNOWN' &&
      response.data.reason === 'roomDoesNotExist'
    ) {
      console.log(response);
      return res.redirect('/');
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
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  roomCode: PropTypes.string.isRequired,
  userApi: PropTypes.string.isRequired,
};
export default join;
