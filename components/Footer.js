import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import StyledFontAwesomeIcon from './global-styles/StyledFontAwesomeIcon';

const FooterContainer = styled.div`
  position: absolute;
  bottom: 1px;
  font-size: 1.3rem;
  color: white;
  line-height: 0;
  text-align: center;
  p,
  svg {
    color: white;
    margin: 5px;
  }
`;
function Footer(props) {
  return (
    <FooterContainer>
      <p>Created By Trevor DeBardeleben</p>
      <a
        href="https://github.com/trevordebard"
        rel="noopener noreferrer"
        target="_blank"
      >
        <StyledFontAwesomeIcon icon={['fab', 'github']} width="0" />
      </a>

      <a
        href="mailto:trevordebard@gmail.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        <StyledFontAwesomeIcon icon={['fas', 'envelope']} width="0" />
      </a>
    </FooterContainer>
  );
}

Footer.propTypes = {};

export default Footer;
