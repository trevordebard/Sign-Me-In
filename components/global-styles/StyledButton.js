import styled from 'styled-components';

export default styled.button`
  text-transform: uppercase;
  background: ${props => props.theme.primary};
  border: 0;
  padding: ${props => (props.padding ? props.padding : '15px')};
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.primary_light};
    :hover {
      box-shadow: 0 2px 3px hsla(0, 0%, 0%, 0.2);
    }
  }
`;
