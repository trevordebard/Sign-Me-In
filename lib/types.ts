export interface smiResponse {
  status: 'SUCCESS' | 'KNOWN' | 'UNKNOWN';
  reason: any; // TODO: rename field to errorCode
  payload: iResponsePayload;
}
interface iResponsePayload {
  message: string;
  roomCode?: string;
}
