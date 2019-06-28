const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const http = require('http');
const SocketIO = require('socket.io');
require('dotenv').config();
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
nextApp
  .prepare()
  .then(() => {
    const app = express();
    app.use(cors());
    const server = http.Server(app);
    const io = SocketIO(server);
    const apiUrl = process.env.API_URL;

    app.get('/room/:roomCode', (req, res) => {
      return nextApp.render(req, res, '/room', {
        roomCode: req.params.roomCode,
        apiUrl,
      });
    });
    app.get('/join/:roomCode', (req, res) => {
      return nextApp.render(req, res, '/join', {
        roomCode: req.params.roomCode,
        apiUrl,
      });
    });

    app.get('*', (req, res) => {
      return handle(req, res, '/notfound');
    });
    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });

    io.on('connection', socket => {
      console.log('connection!');
      socket.emit('news', { hello: 'world' });
      socket.on('new-user', data => {
        console.log('server: new user');
        const { roomCode, ...user } = data;
        socket.to(roomCode).emit('add-user', { user });
      });
      socket.on('join-room', roomCode => {
        console.log('server: join room');
        socket.join(roomCode);
      });
      socket.on('error', res => {
        console.log('err');
        console.log(res);
      });
    });
    // app.listen(3000, err => {
    //   if (err) throw err;
    //   console.log('> Ready on http://localhost:3000');
    // });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
