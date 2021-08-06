var express = require('express');
var app = express();
const path = require('path');
var http = require('http').createServer(app);
const WebSocket = require('ws');
const mysql = require('mysql');
let LOBBY = 0;
let CLIENTS = [];
let USERS = [];

app.use(express.static(path.join(__dirname,"..","non-react")));

http.listen(process.env.PORT || 5000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});

let webSocketServer = new WebSocket.Server({server: http});

webSocketServer.on('connection', function(ws){
  
  ws.on('message',function(message) {
    let msg = JSON.parse(message);

    // Logic for the initial join process : TODO - move this
    if(msg.actnName === "join"){
      if(CLIENTS.length === 0){
        if(checkForClient(msg.actnUsername) === -1){
          CLIENTS.push(ws);
          USERS.push(msg.actnUsername);
          CLIENTS[0].send(JSON.stringify({ actnName:'host', actnIndex:CLIENTS.length -1, actnPlayerNumber:'player-one',actnTarget:'player', actnUsername:msg.actnUsername}));
        } else{
          console.log("REJOINING AS "+msg.actnUsername);
        }
      } else if(CLIENTS.length === 1 && checkForClient(msg.actnUsername) === -1){
        console.log(checkForClient(msg.actnUsername));
        CLIENTS.push(ws);
        USERS.push(msg.actnUsername);
        console.log(USERS);
        CLIENTS[1].send(JSON.stringify({
          actnName:'player-two',
          actnIndex:CLIENTS.length -1,
          actnPlayerNumber:'player-two',
          actnTarget:'player',
          actnUsername:msg.actnUsername
        }));
      }else if(CLIENTS.length > 1 && checkForClient(msg.actnUsername) === -1){
        CLIENTS.push(ws);
        USERS.push(msg.actnUsername);
        console.log(USERS);
        CLIENTS[CLIENTS.length-1].send(JSON.stringify({
          actnName:'spectater',
          actnIndex:CLIENTS.length - 1,
          actnUsername:msg.actnUsername
        }));
      }
    } else if(msg.actName === "leave"){
      let userIndex = checkForClient(msg.actnUsername);
      if(userIndex !== -1){
        USERS.splice(userIndex,1);
        CLIENTS.splice(userIndex,1);
      }
    } else if(msg.actnName === "server-tap"){
      // DO NOTHING, THIS IS FINE
    } else{
      sendAll(message, ws);
    }
  });
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


// SOME METHODS (LEARN HOW TO SPLIT THESE OUT)

const checkForClient = username => {
  for(let i = 0; i < USERS.length; i++){
    if(USERS[i] === username) return i;
  }

  return -1;
}