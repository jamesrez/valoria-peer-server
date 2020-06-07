const express = require('express');
const { ExpressPeerServer } = require('peer');
require('dotenv').config();

const app = express();

app.get('/', (req, res, next) => res.send("Hi! I'm the Valorian Peer Server"));

const server = app.listen(process.env.PORT);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/valoria'
});
app.use('/peerjs', peerServer);
