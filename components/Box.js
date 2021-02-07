import styled from 'styled-components';

export default styled.div`
  background: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  min-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding: 20px 0;
  max-height: 80%;
  max-width: 80%;
  border-radius: 5px;
  @media screen and (max-width: 479px) {
    width: 95%;
    max-width: 95%;
    min-width: 3px;
    max-height: 90%;
  }
`;
