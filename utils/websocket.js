// const WebSocket = require('ws');

// const PORT = 5000;

// const webSocketServer = new WebSocket.Server({port: PORT});

// webSocketServer.on('connnection', function connection(ws) {
//   ws.on('message', function incoming(data) {
//     webSocketServer.clients.forEach(function each(client) {
//       if(client !== ws && client.readyState === WebSocket.OPEN){
//         client.send(data);
//       }
//     })
//   })
// })


// // CONNECT REACT APP

// const express = require('express');
// const path = require('path');

// const app = express();

// app.use(express.static(path.join(__dirname, '../src')));

// app.get('*', (req,res) => {
//   res.sendFile(path.join(__dirname+'../src/index.js'));
// });

// app.listen(PORT);

var express = require('express');
var app = express();
const path = require('path');
var http = require('http').createServer(app);
const WebSocket = require('ws');
let CLIENTS = [];

app.use(express.static(path.join(__dirname,"..","build")));

http.listen(process.env.PORT || 5000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});

let webSocketServer = new WebSocket.Server({server: http});

webSocketServer.on('connection', function(ws){
  console.log("CONNECTION ESTABLISHED = ",ws);
  CLIENTS.push(ws);
  
  ws.on('message',function(message) {
    console.log('received: %s', message);
    console.log("CLIENTS = ",CLIENTS);
    sendAll(message);
  })
});

const sendAll = message => {
  for(var i=0; i<CLIENTS.length;i++){
    CLIENTS[i].send(message);
  }
}

// webSocketServer.on('connnection', function connection(ws) {
//   ws.on('request', (request) => {
//     console.log(request.origin);
//   });
//   ws.on('message', function incoming(data) {
//     webSocketServer.clients.forEach(function each(client) {
//       if(client !== ws && client.readyState === WebSocket.OPEN){
//         client.send(data);
//       }
//     })
//   })
// });