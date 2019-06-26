import styled from 'styled-components';

const StyledInput = styled.input`
  /* Consider background #f2f2f2 with no border */
  box-shadow: 0 1px 3px hsla(0, 0%, 0%, 0.1);
  font-size: 1.5rem;
  padding: 0.6em 1em;
  color: hsl(209, 34%, 30%);
  border: 1px solid ${props => props.theme.grey};
  border-radius: 2px;
  margin-right: 5px;
  ::placeholder {
    color: ${props => props.theme.grey};
  }
  :hover {
    box-shadow: 0 2px 3px hsla(0, 0%, 0%, 0.2);
  }
  :focus {
    outline: none;
    border: 1px solid ${props => props.theme.primary};
  }
`;

export default StyledInput;
