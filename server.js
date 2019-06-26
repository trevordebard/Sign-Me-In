const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
app
  .prepare()
  .then(() => {
    const server = express();
    const apiUrl = process.env.API_URL;

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
