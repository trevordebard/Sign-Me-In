import React from 'react';
import Router from 'next/router';
import axios from 'axios';
import PropTypes from 'prop-types';

function room({ roomCode, users }) {
  return <div>{roomCode}</div>;
}

room.propTypes = {};
room.getInitialProps = async ({ query, req, res }) => {
  const { roomCode, apiUrl } = query;
  try {
    const response = await axios.get(`${apiUrl}/room/${roomCode}`);

    if (
      response.data.status === 'KNOWN' &&
      response.data.reason === 'roomDoesNotExist'
    ) {
      res.redirect('/');
    }
    return { roomCode, users: response.data.payload };
  } catch (err) {
    console.log(err);
  }
};
export default room;
