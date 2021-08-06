var express = require('express');
var app = express();
const path = require('path');
var http = require('http').createServer(app);
const WebSocket = require('ws');
const mysql = require('mysql');
let CLIENTS = [];

app.use(express.static(path.join(__dirname,"..","non-react")));

http.listen(process.env.PORT || 5000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});

let webSocketServer = new WebSocket.Server({server: http});

webSocketServer.on('connection', function(ws){
  CLIENTS.push(ws);
  if(CLIENTS.length === 1) console.log("You are the first client to join, making you host...");
  
  ws.on('message',function(message) {
    console.log('received: %s', message);
    sendAll(message, ws);
  })
});

const sendAll = (message, sender) => {
  for(var i=0; i<CLIENTS.length;i++){
    if(CLIENTS[i] !== sender) CLIENTS[i].send(message);
  }
}

// DATABASE
// var connection;

// const connectToDB = (username,password) =>{
//   connection = mysql.createConnection({
//     host: 'rossdanielconover.com',
//     user: username,
//     password: password,
//     database: 'rossdani_tcg-engine'
//   });
  
//   connection.connect(function(err){
//     if(err) throw err;
//     console.log("CONNECTED!");
//   });
// }

// connectToDB("rossdani_tcgAdmin","");