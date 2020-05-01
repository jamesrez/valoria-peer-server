const express = require('express');
const { ExpressPeerServer } = require('peer');
require('dotenv').config();
var data = null;

const app = express();

app.get('/', (req, res, next) => res.send('Hello world!'));

const server = app.listen(process.env.PORT);

const startPeerServer = () => {
  const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/valoria'
  });
  app.use('/peerjs', peerServer);
  peerServer.on('disconnect', (client) => {
    console.log(client)
  });

}

const AWS = require('aws-sdk');
var s3 = null;

if(!process.env.DEVELOPMENT){
  AWS.config.update({region: 'us-west-1'});
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  s3.getObject({Bucket : "valoria", Key : "data.json"}, function(err, fileData) {
    if(err) console.log(err, err.stack);
    else {
      data = JSON.parse(fileData.Body.toString())
      data.online = {};
      saveData(() => {
        startPeerServer();
      });
    }
  })
}

function saveData(cb) {
  if(!process.env.DEVELOPMENT){
    s3.upload({Bucket : "valoria", Key : "data.json", Body : JSON.stringify(data, null, 2)}, (err, fileData) => {
      if (err) console.error(`Upload Error ${err}`);
      if(cb && typeof cb == 'function') cb();
    });
  }
}
