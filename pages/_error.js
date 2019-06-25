import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Layout from '../components/Layout';
import Box from '../components/Box';
import Divider from '../components/global-styles/Divider';
import theme from '../theme';

function generate(props) {
  const { reason } = props;
  return (
    <Layout>
      <Box>
        <h3>That Page Could Not Be Found</h3>
        <Divider />
        <div style={{ color: theme.red }}>
          <strong>Reason: </strong>
          {reason}
        </div>
      </Box>
    </Layout>
  );
}

generate.propTypes = {};

export default generate;
