const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const db = require('./queries');

app
  .prepare()
  .then(() => {
    const server = express();
    const router = express.Router();
    const apiUrl = process.env.API_URL;
    server.use(bodyParser.json());
    server.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );

    // router.get is /api calls
    router.get('/room/:roomCode', db.getUsers);
    router.get('/fields/:roomCode', db.getRoomFields);
    router.post('/room', db.createRoom);
    router.post('/user', db.addUser);

    // server.get is for when a next/link gets clicked
    server.get('/room/:roomCode', (req, res) => {
      return app.render(req, res, '/room', {
        roomCode: req.params.roomCode,
        apiUrl,
      });
    });
    server.get('/join/:roomCode', (req, res) => {
      return app.render(req, res, '/join', {
        roomCode: req.params.roomCode,
        apiUrl,
      });
    });

    server.post('/room', db.createRoom);

    server.use('/api', router);
    server.get('*', (req, res) => {
      return handle(req, res, '/notfound');
    });
    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
