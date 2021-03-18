import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const generateRandomString = length => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

async function getUniqueRoom(): Promise<string> {
  let attempts: number = 0;
  const maxAttempts: number = 4;
  let roomCode: string = 'abcd';
  let roomAlreadyExists: boolean = true;

  // Generate a room code. If the room exists, try again until max attempts are reached
  while (roomAlreadyExists && attempts < maxAttempts) {
    roomCode = generateRandomString(4);
    roomAlreadyExists = !!(await prisma.rooms.findFirst({
      where: { room_code: { equals: roomCode } },
    }));
    attempts += 1;
  }
  return roomCode;
}

interface smiResponse {
  status: 'SUCCESS' | 'KNOWN' | 'UNKNOWN';
  reason: any; // TODO: rename field to errorCode
  payload: iResponsePayload;
}
interface iResponsePayload {
  message: string;
  roomCode?: string;
}
async function createRoom(req: NextApiRequest, res: NextApiResponse) {
  const roomCode = await getUniqueRoom();
  const { fields } = req.body;
  try {
    const room = await prisma.rooms.create({
      data: { room_code: roomCode, fields },
    });
    const responseData: smiResponse = {
      status: 'SUCCESS',
      reason: null,
      payload: {
        message: `${room.room_code} created successfully!`,
        roomCode: room.room_code,
      },
    };
    return res.status(201).json(responseData);
  } catch (e) {
    console.error(`The error below occurred when generating room: ${roomCode}`);
    console.error(e);
    const errResponse: smiResponse = {
      status: 'UNKNOWN',
      reason: null,
      payload: {
        message: `There was an unkown error generating a room. Please try again or contact support`,
      },
    };
    return res.status(401).json(errResponse);
  }
}

export { createRoom, generateRandomString };
