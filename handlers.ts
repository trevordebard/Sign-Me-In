import { Request, Response } from 'express';
import { createRoom, getFields, getUsers } from './utils/queries';

async function createRoomHandler(req: Request, res: Response) {
  const { fields } = req.body;

  const createResponse = await createRoom(fields);

  if (createResponse.status === 'SUCCESS') {
    return res.status(201).json(createResponse);
  }

  return res.status(401).json(createResponse);
}
async function getFieldsHandler(req: Request, res: Response) {
  const { roomCode } = req.params;

  const fieldsResponse = await getFields(roomCode);

  if (fieldsResponse.status === 'SUCCESS') {
    return res.status(200).json(fieldsResponse);
  }
  return res.status(400).json(fieldsResponse);
}

async function getUsersHandler(req: Request, res: Response) {
  const { roomCode } = req.params;

  const usersResponse = await getUsers(roomCode);

  if (usersResponse.status === 'SUCCESS') {
    return res.status(200).json(usersResponse);
  }
  return res.status(400).json(usersResponse);
}

export { createRoomHandler, getFieldsHandler, getUsersHandler };
