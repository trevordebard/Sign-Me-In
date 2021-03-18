import { users } from '@prisma/client';

export interface smiResponse {
  status: 'SUCCESS' | 'KNOWN' | 'UNKNOWN';
  reason: 'roomDoesNotExist' | 'connectionRefused'; // TODO: rename field to errorCode
  payload: iResponsePayload;
}
interface iResponsePayload {
  message: string;
  roomCode?: string;
  [otherOptions: string]: any;
}

export interface iGetFieldsResponse extends smiResponse {
  payload: iGetFieldsPayload;
}
interface iGetFieldsPayload extends iResponsePayload {
  fields: string[];
}

export interface iGetUsersResponse extends smiResponse {
  payload: iGetUsersPayload;
}
interface iGetUsersPayload extends iResponsePayload {
  users: users[];
}
