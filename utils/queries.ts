import prisma from '../prisma/client';
import { generateRandomString } from '.';
import { smiResponse } from '../lib/types';

async function createRoom(fields: string[]): Promise<smiResponse> {
  const roomCode = await getUniqueRoom();
  let responseData: smiResponse = null;
  try {
    const room = await prisma.rooms.create({
      data: { room_code: roomCode, fields },
    });
    responseData = {
      status: 'SUCCESS',
      reason: null,
      payload: {
        message: `${room.room_code} created successfully!`,
        roomCode: room.room_code,
      },
    };
  } catch (e) {
    console.error(`The error below occurred when generating room: ${roomCode}`);
    console.error(e);
    responseData = {
      status: 'UNKNOWN',
      reason: null,
      payload: {
        message: `There was an unkown error generating a room. Please try again or contact support`,
      },
    };
  }
  return responseData;
}

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
export { createRoom };
