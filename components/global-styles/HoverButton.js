import styled from 'styled-components';

export default styled.button`
  color: ${props => props.theme.secondary};
  background-color: white;
  border: 1px solid ${props => props.theme.secondary};
  border-radius: 2px;
  display: inline-block;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: inset 0 0 0 0 ${props => props.theme.secondary};
  transition: ease-out 0.3s;
  :hover {
    box-shadow: inset 400px 0 0 0 ${props => props.theme.secondary};
    color: white;
  }
  :focus {
    outline: none;
  }
`;
