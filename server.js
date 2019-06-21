const express = require('express');
const next = require('next');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const db = require('./queries');

console.log(process.env.API_URL);
console.log(process.env.DB_PORT);
app
  .prepare()
  .then(() => {
    const server = express();
    const router = express.Router();
    const apiUrl = process.env.API_URL;
    console.log(apiUrl);
    router.get('/room/:roomCode', db.getUsers);
    router.post('/room', db.createRoom);
    router.post('/user', db.addUser);

    server.get('/room/:roomCode', (req, res) => {
      return app.render(req, res, '/room', {
        roomCode: req.params.roomCode,
        apiUrl,
      });
    });

    server.use('/api', router);
    server.get('*', (req, res) => {
      return handle(req, res);
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
