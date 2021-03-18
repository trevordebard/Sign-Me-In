import { Request, Response } from 'express';
import { createRoom, getFields } from './utils/queries';

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

export { createRoomHandler, getFieldsHandler };
