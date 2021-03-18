import express from 'express';
import next from 'next';
import bodyParser from 'body-parser';
import http from 'http';
import SocketIO from 'socket.io';
import cors from 'cors';
import { createRoomHandler, getFieldsHandler } from './handlers';

require('dotenv').config();
const db = require('./queries');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
nextApp
  .prepare()
  .then(() => {
    const app = express();
    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://www.signmein.org',
      'https://smi-staging.herokuapp.com',
    ];
    app.use(
      cors({
        origin(origin, callback) {
          // allow requests with no origin
          // (like mobile apps or curl requests)
          if (!origin) return callback(null, true);
          if (allowedOrigins.indexOf(origin) === -1) {
            const msg =
              'The CORS policy for this site does not ' +
              'allow access from the specified Origin.';
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        },
      })
    );
    const server = new http.Server(app);
    const io = new SocketIO.Server(server);

    app.get('/api/fields/:roomCode', getFieldsHandler);
    app.get('/api/room/:roomCode', db.getUsers);
    app.post('/api/room', createRoomHandler);
    app.post('/api/user', db.addUser);

    app.get('*', (req, res) => {
      // @ts-ignore
      return handle(req, res, '/notfound');
    });
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`> Ready on port ${port}`);
    });

    io.on('connection', socket => {
      console.log('connection!');
      socket.emit('news', { hello: 'world' });
      socket.on('new-user', data => {
        const { roomCode, ...user } = data;
        socket.to(roomCode).emit('add-user', { user });
      });
      socket.on('join-room', roomCode => {
        socket.join(roomCode);
      });
      socket.on('error', res => {
        console.log('err');
        console.log(res);
      });
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
