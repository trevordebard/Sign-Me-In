import { ButtonHTMLAttributes, FC } from 'react';
import styled, { css } from 'styled-components';
import { Spinner, SpinnerContainer } from './Spinner';

interface iButtonProps {
  outline?: boolean;
  padding?: string;
  loading?: boolean;
}
const StyledButton = styled.button<iButtonProps>`
  background-color: ${props => props.theme.primary};
  color: white;
  border-radius: 5px;
  border: 0px;
  padding: ${props => (props.padding ? props.padding : '15px')};
  font-size: 1.6rem;
  overflow: auto;
  cursor: pointer;
  &:hover {
    box-shadow: var(--level2);
    background-color: ${props => props.theme.primary_light};
  }
  &:disabled {
    background-color: ${props => props.theme.primary_light};
    cursor: auto;
    &:hover {
      box-shadow: none;
      background-color: ${props => props.theme.primary_light};
    }
  }
  ${props => props.outline && outlineCss};
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

const Button: FC<
  iButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
> = props => {
  const { loading, children } = props;
  return (
    <StyledButton {...props}>
      {loading && (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      )}
      <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </span>
    </StyledButton>
  );
};
export default Button;
