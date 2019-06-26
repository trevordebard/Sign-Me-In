import styled from 'styled-components';

const DividerWithText = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: hsl(0, 0%, 80%);
  text-transform: uppercase;

  :before,
  :after {
    content: '';
    border-top: 1px solid hsl(0, 0%, 80%);
    margin: 0 20px 0 0;
    flex: 1 0 20px;
  }

  :after {
    margin: 0 0 0 20px;
  }
`;
export default DividerWithText;
