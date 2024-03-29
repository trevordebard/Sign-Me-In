import axios, { AxiosResponse } from 'axios';
import { iGetFieldsResponse, iGetUsersResponse } from './types';

export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://www.signmein.org/api'
    : process.env.NEXT_PUBLIC_API_URL;

export const getUsers = async roomCode => {
  try {
    const response: AxiosResponse<iGetUsersResponse> = await axios.get(
      `${API_URL}/room/${roomCode}`
    );

    if (response.data.status === 'SUCCESS') {
      return { roomCode, users: response.data.payload.users };
    }
    return { error: true, message: 'An unknown error occurred', roomCode };
  } catch (err) {
    if (err.response.data.status === 'KNOWN') {
      if (err.response.data.reason === 'roomDoesNotExist') {
        return {
          message: err.response.data.payload.message,
          roomCode,
        };
      }
      if (err.response.data.reason === 'connectionRefused') {
        return {
          error: err.response.data.payload.error,
          message: err.response.data.payload.message,
          roomCode,
        };
      }
      return { error: true, message: 'An unknown error occurred', roomCode };
    }
    return {
      error: err,
      message: 'And unkown error occurred',
      roomCode,
    };
  }
};

export const getRoomInfo = async roomCode => {
  try {
    const response: AxiosResponse<iGetFieldsResponse> = await axios.get(
      `${API_URL}/fields/${roomCode}`
    );
    return {
      roomExists: true,
      fields: response.data.payload.fields,
      userApi: `${API_URL}/user`,
      roomCode,
    };
  } catch (err) {
    if (err.response.data.status === 'KNOWN') {
      if (err.response.data.reason === 'roomDoesNotExist') {
        return {
          roomExists: false,
          status: 'KNOWN',
          reason: 'roomDoesNotExist',
        };
      }
      if (err.response.data.reason === 'connectionRefused') {
        return {
          error: true,
          message: err.response.data.payload.message,
          status: 'KNOWN',
          reason: 'connectionRefused',
        };
      }
    }
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

interface iGenerateRoomResponse {
  status: string;
  reason: string;
  payload: any;
  err?: boolean;
}
export const generateRoom = async (
  fields
): Promise<AxiosResponse<iGenerateRoomResponse>> => {
  const response = await axios.post(`${API_URL}/room`, {
    fields,
  });
  return response;
};
