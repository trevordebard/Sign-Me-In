const { Pool } = require('pg');
const utils = require('pg/lib/utils');

const Response = require('./Response');

const status = {
  UNKOWN: 'UNKNOWN',
  KNOWN: 'KNOWN',
  SUCCESS: 'SUCCESS',
};
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const flattenObject = obj => {
  const flattened = {};

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key]));
    } else {
      flattened[key] = obj[key];
    }
  });

  return flattened;
};

const doesRoomExist = async roomCode => {
  try {
    const result = await pool.query(
      `SELECT id FROM rooms WHERE room_code=$1;`,
      [roomCode]
    );
    if (result.rows.length > 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const generateRandomString = length => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const getUsers = async (req, res) => {
  const { roomCode } = req.params;
  const roomExists = await doesRoomExist(roomCode);
  if (!roomExists) {
    return res.json(
      new Response(status.KNOWN, 'roomDoesNotExist', {
        message: 'That room does not exist.',
      })
    );
  }
  try {
    const results = await pool.query(
      `SELECT first_name, last_name, data FROM users WHERE room_code=$1;`,
      [roomCode]
    );
    const payload = results.rows.map(userObj => {
      return {
        ...flattenObject(userObj),
        display_name: `${userObj.first_name} ${userObj.last_name}`,
      };
    });
    return res.json(new Response(status.SUCCESS, null, payload));
  } catch (err) {
    console.log('getUsers error');
    return res.json(new Response(status.UNKOWN, null, { error: err }));
  }
};
/**
 * For now,
 * @fields must be of format ["string", "string 1", "etc"]
 */
const createRoom = async (req, res) => {
  const roomCode = generateRandomString(4);
  const roomExists = await doesRoomExist(roomCode);
  if (roomExists) {
    return res.json(
      new Response(status.KNOWN, 'roomExists', {
        message: 'That room already exists.',
      })
    );
  }

  let { fields } = req.body;
  if (fields) {
    // Converts field array into format pg db can read.
    if (typeof fields === 'string') {
      fields = JSON.parse(fields);
    }
    fields = utils.prepareValue(fields);
  } else {
    fields = null;
  }
  try {
    const query = `INSERT INTO rooms (room_code, fields) VALUES ($1, $2);`;
    const results = await pool.query(query, [roomCode, fields]);
    return res.json(
      new Response(status.SUCCESS, null, {
        message: 'Room created successfully',
        roomCode,
      })
    );
  } catch (err) {
    res.json(new Response(status.UNKOWN, null, { error: err }));
  }
};

/**
 * data in format {"email": "asldk@aslkd.com", "blah": "blob"}
 */
const addUser = async (req, res) => {
  const { roomCode, first_name, last_name } = req.body;
  let { data } = req.body;
  if (!data) {
    data = null;
  } else {
    data = utils.prepareValue(data);
  }
  const roomExists = await doesRoomExist(roomCode);
  if (!roomExists) {
    return res.json(
      new Response(status.KNOWN, 'roomDoesNotExist', {
        message: 'That room does not exist',
      })
    );
  }
  try {
    // `INSERT INTO users (room_code, first_name, last_name, data) VALUES ('${roomCode}', '${first_name}', '${last_name}', '${data}');`
    const results = await pool.query(
      `INSERT INTO users (room_code, first_name, last_name, data) VALUES ($1, $2, $3, $4);`,
      [roomCode, first_name, last_name, data]
    );
    res.json(
      new Response(status.SUCCESS, null, {
        message: `User successfully added to room: ${roomCode}`,
      })
    );
  } catch (err) {
    res.json(new Response(status.UNKOWN, null, { error: err }));
  }
};

const getRoomFields = async (req, res) => {
  const { roomCode } = req.params;
  const roomExists = await doesRoomExist(roomCode);
  if (!roomExists) {
    return res.json(
      new Response(status.KNOWN, 'roomDoesNotExist', {
        message: 'That room does not exist.',
      })
    );
  }
  try {
    const results = await pool.query(
      `SELECT fields FROM rooms WHERE room_code=$1;`,
      [roomCode]
    );
    const payload = results.rows[0].fields;
    if (!payload) {
      return res.json(
        new Response(status.UNKOWN, 'Unkown Error', {
          message:
            'There was a problem. Make sure you spelled the room name correctly.',
        })
      );
    }
    return res.json(new Response(status.SUCCESS, null, payload));
  } catch (err) {
    return res.json(new Response(status.UNKOWN, null, { error: err }));
  }
};

module.exports = {
  getUsers,
  createRoom,
  addUser,
  doesRoomExist,
  getRoomFields,
};
