import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Layout from '../components/Layout';
import Box from '../components/Box';
import Divider from '../components/global-styles/Divider';
import theme from '../theme';

function notfound(props) {
  const { reason } = props;
  let message = 'UNKOWN';
  if (reason && reason === 'roomDoesNotExist') {
    message = 'That room does not exist';
  }
  return (
    <Layout>
      <Box>
        <h3>That Page Could Not Be Found</h3>
        <Divider />
        <div style={{ color: theme.red }}>
          <strong>Reason: </strong>
          {message}
        </div>
      </Box>
    </Layout>
  );
}
notfound.getInitialProps = ({ query }) => {
  const { reason } = query;
  return { reason };
};

notfound.propTypes = {};

export default notfound;
