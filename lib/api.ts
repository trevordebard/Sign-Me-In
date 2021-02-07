import axios, { AxiosResponse } from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUsers = async roomCode => {
  try {
    const response = await axios.get(`${API_URL}/room/${roomCode}`);
    if (response.data.status === 'KNOWN') {
      if (response.data.reason === 'roomDoesNotExist') {
        return {
          message: response.data.payload.message,
          roomCode,
        };
      }
      if (response.data.reason === 'connectionRefused') {
        return {
          error: response.data.payload.error,
          message: response.data.payload.message,
          roomCode,
        };
      }
      return { error: true, message: 'An unknown error occurred', roomCode };
    }
    if (response.data.status === 'SUCCESS') {
      return { roomCode, users: response.data.payload };
    }
    return { error: true, message: 'An unknown error occurred', roomCode };
  } catch (err) {
    return {
      error: err,
      message: 'And unkown error occurred',
      roomCode,
    };
  }
};

export const getRoomInfo = async roomCode => {
  try {
    const response = await axios.get(`${API_URL}/fields/${roomCode}`);
    if (response.data.status === 'KNOWN') {
      if (response.data.reason === 'roomDoesNotExist') {
        return {
          roomExists: false,
          status: 'KNOWN',
          reason: 'roomDoesNotExist',
        };
      }
      if (response.data.reason === 'connectionRefused') {
        return {
          error: true,
          message: response.data.payload.message,
          status: 'KNOWN',
          reason: 'connectionRefused',
        };
      }
    }
    return {
      roomExists: true,
      fields: response.data.payload,
      userApi: `${API_URL}/user`,
      roomCode,
    };
  } catch (err) {
    return { roomExists: false, error: err };
  }
};

export const addUser = async payload => {
  const response = await axios.post(`${API_URL}/user`, payload);
  if (response.data.status === 'SUCCESS') {
    return { status: 'SUCCESS' };
  }
  if (response.data.status === 'KNOWN') {
    if (response.data.reason === 'roomDoesNotExist') {
      return {
        status: 'KNOWN',
        reason: 'roomDoesNotExist',
        message: 'That room does not exist.',
      };
    }
  }
  return {
    status: 'UNKNOWN',
    message: 'An unknown error has occurred.',
  };
};

export const generateRoom = async (fields): Promise<AxiosResponse<{fields?: string[], status?: string}>> => {
  let response: AxiosResponse<{ fields: string[] }>;
  try {
    response = await axios.post(`${API_URL}/room`, {
      fields,
    });
  } catch (err) {
    console.log(err);
    return { err };
  }
  return response;
};
