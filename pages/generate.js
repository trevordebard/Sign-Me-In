import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Box from '../components/Box';
import Divider from '../components/global-styles/Divider';
import StyledFontAwesomeIcon from '../components/global-styles/StyledFontAwesomeIcon';
import theme from '../theme';
import StyledButton from '../components/global-styles/StyledButton';
import HoverButton from '../components/global-styles/HoverButton';
import generateRoom from '../components/Generate/generateRoom';

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
  input {
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
      border: 1px solid ${props => props.theme.secondary};
      box-shadow: 0 2px 3px hsla(0, 0%, 0%, 0.2);
    }
    :focus {
      outline: none;
      border: 2px solid ${props => props.theme.secondary};
    }
  }
`;

function generate(props) {
  const [roomFields, setRoomFields] = useState(['First Name', 'Last Name']);
  const [fieldInput, setFieldInput] = useState('');

  const addField = () => {
    setRoomFields([...roomFields, fieldInput]);
    setFieldInput('');
  };
  const removeField = value => {
    setRoomFields(roomFields.filter(field => field !== value));
  };
  const handleFieldInputChange = e => setFieldInput(e.target.value);

  const handleCreate = async () => {
    const res = await generateRoom(roomFields);
    if (res && res.data.status === 'SUCCESS') {
      Router.push(`/room/${res.data.payload.roomCode}`);
    }
  };

  return (
    <Layout>
      <Box>
        <h3>What information do you need?</h3>
        <Divider />
        <StyledList>
          {roomFields.map(field => {
            return (
              <li>
                <p>{field}</p>
                <StyledFontAwesomeIcon
                  icon="trash-alt"
                  value="test"
                  colors={{
                    default: theme.grey,
                    hover: theme.red,
                  }}
                  onClick={() => removeField(field)}
                />
              </li>
            );
          })}
        </StyledList>
        <InputContainer>
          <input
            type="text"
            onChange={e => handleFieldInputChange(e)}
            value={fieldInput}
            placeholder="Enter Field"
          ></input>
          <HoverButton type="button" onClick={addField} padding="1.2rem">
            ADD
          </HoverButton>
        </InputContainer>
        <StyledButton onClick={handleCreate} type="button" padding="1.2rem">
          Create Room
        </StyledButton>
      </Box>
    </Layout>
  );
}

generate.propTypes = {};

export default generate;
