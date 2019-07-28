import React, { useState } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Box from '../components/Box';
import Divider from '../components/global-styles/Divider';
import StyledFontAwesomeIcon from '../components/global-styles/StyledFontAwesomeIcon';
import theme from '../theme';
import StyledButton from '../components/global-styles/StyledButton';
import HoverButton from '../components/global-styles/HoverButton';
import StyledInput from '../components/global-styles/StyledInput';
import ErrorText from '../components/global-styles/ErrorText';
import * as api from '../lib/api';

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 80%;
  li {
    margin: 0;
    padding: 5px;
    border-bottom: 1px solid ${props => props.theme.grey_light1};
    display: flex;
    align-items: center;
    justify-content: space-between;
    :hover {
      background-color: ${props => props.theme.grey_light2};
    }
    :last-child {
      border: none;
    }
  }
  p {
    margin: 0;
  }
`;

const InputContainer = styled.div`
  display: flex;
  margin: 1.5rem auto;
`;

function generate() {
  const [roomFields, setRoomFields] = useState(['First Name', 'Last Name']);
  const [fieldInput, setFieldInput] = useState('');
  const [error, setError] = useState(null);

  const addField = () => {
    if (fieldInput !== '') {
      setRoomFields([...roomFields, fieldInput]);
      setFieldInput('');
    }
  };
  const removeField = value => {
    setRoomFields(roomFields.filter(field => field !== value));
  };
  const handleFieldInputChange = e => setFieldInput(e.target.value);

  const handleCreate = async () => {
    const res = await api.generateRoom(roomFields);
    if (res && res.data.status === 'SUCCESS') {
      Router.push(`/room/${res.data.payload.roomCode}`);
    } else if (res.data.status === 'KNOWN') {
      setError(res.data.payload.message);
    } else if (res.err) {
      console.log('There was an Unkown error');
    } else {
      setError('Unkown error. Please try again or contact support');
    }
  };

  return (
    <Layout>
      <Box>
        <h3>What information do you need?</h3>
        <Divider />
        <StyledList>
          {roomFields.map((field, index) => {
            return (
              <li key={`${new Date()}_${field}`}>
                <p>{field}</p>
                {index > 1 && (
                  <StyledFontAwesomeIcon
                    icon="trash-alt"
                    value="test"
                    colors={{
                      default: theme.grey,
                      hover: theme.red,
                    }}
                    onClick={() => removeField(field)}
                  />
                )}
              </li>
            );
          })}
        </StyledList>
        <InputContainer>
          <StyledInput
            type="text"
            onChange={e => handleFieldInputChange(e)}
            value={fieldInput}
            placeholder="Enter Field"
          ></StyledInput>
          <HoverButton type="button" onClick={addField} padding="1.2rem">
            ADD
          </HoverButton>
        </InputContainer>
        <StyledButton onClick={handleCreate} type="button" padding="1.2rem">
          Create Room
        </StyledButton>
        {error && <ErrorText>{error}</ErrorText>}
      </Box>
    </Layout>
  );
}

generate.propTypes = {};

export default generate;
