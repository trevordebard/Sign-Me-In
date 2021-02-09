import styled, { css } from 'styled-components';

interface iButtonProps {
  outline?: boolean;
  padding?: string;
}
const StyledButton = styled.button<iButtonProps>`
  background-color: ${props => props.theme.primary};
  color: white;
  border-radius: 5px;
  border: 0px;
  padding: ${props => (props.padding ? props.padding : '15px')};
  font-size: 1.6rem;
  cursor: pointer;
  &:hover {
    box-shadow: var(--level2);
    background-color: ${props => props.theme.primary_light};
  }
  &:disabled {
    background-color: var(--buttonSubtle);
    cursor: auto;
    &:hover {
      box-shadow: none;
      background-color: var(--buttonSubtle);
    }
  }
  ${props => props.outline && outlineCss}
`;

const outlineCss = css`
  background-color: transparent;
  border: 1px solid ${props => props.theme.primary};
  color: ${props => props.theme.primary};
  :hover {
    color: white;
    background-color: ${props => props.theme.primary};
  }
`;

export default StyledButton;
