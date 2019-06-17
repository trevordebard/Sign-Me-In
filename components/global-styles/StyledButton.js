import styled from 'styled-components';

export default styled.button`
  text-transform: uppercase;
  background: ${props => props.theme.primary};
  border: 0;
  padding: 15px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.primary_light};
  }
`;
