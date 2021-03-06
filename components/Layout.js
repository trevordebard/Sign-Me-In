import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Footer from './Footer';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    to left,
    ${props => props.theme.primary},
    hsl(283, 39%, 53%)
  );
`;

function Layout(props) {
  const { children } = props;
  return (
    <Container>
      {children}
      <Footer />
    </Container>
  );
}
Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;
