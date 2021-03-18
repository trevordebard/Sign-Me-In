import { NextApiRequest, NextApiResponse } from 'next';
import { createRoom } from './utils/queries';
import { generateRandomString } from './utils';

async function createRoomHandler(req: NextApiRequest, res: NextApiResponse) {
  const { fields } = req.body;

  const createResponse = await createRoom(fields);

  if (createResponse.status === 'SUCCESS') {
    return res.status(201).json(createResponse);
  }

  return res.status(401).json(createResponse);
}

export { createRoomHandler, generateRandomString };
