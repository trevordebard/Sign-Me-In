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

interface iGetFieldsPayload extends iResponsePayload {
  fields: string[];
}

export interface iGetFieldsResponse extends smiResponse {
  payload: iGetFieldsPayload;
}
