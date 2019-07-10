import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import Box from '../components/Box';

function generate(props) {
  return (
    <Layout>
      <Box>
        <h3>That Page Could Not Be Found</h3>
        <Link href="/">
          <a>Click here to go home</a>
        </Link>
      </Box>
    </Layout>
  );
}

generate.propTypes = {};

export default generate;
