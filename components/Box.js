import styled from 'styled-components';

export default styled.div`
  background: white;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  min-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding: 20px 0;
  max-height: 80%;
  max-width: 80%;
  @media screen and (max-width: 479px) {
    width: 95%;
    max-width: 95%;
    min-width: 3px;
    max-height: 90%;
  }
`;
