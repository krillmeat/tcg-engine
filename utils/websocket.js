var express = require('express');
var app = express();
const path = require('path');
var http = require('http').createServer(app);
const WebSocket = require('ws');
const mysql = require('mysql');
let LOBBIES = [];

app.use(express.static(path.join(__dirname,"..","non-react")));

http.listen(process.env.PORT || 5000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});

let webSocketServer = new WebSocket.Server({server: http});

webSocketServer.on('connection', function(ws){

  if(LOBBIES.length === 0){
    LOBBIES.push({
      LOBBY_ID: Math.floor(Math.random() * 1000),
      CLIENTS: [],
      USERS: [],
      GAME_STATE: {}
    })
  }
  
  ws.on('message',function(message) {
    let msg = JSON.parse(message);

    // FOR NOW, JUST JOIN THE ONLY LOBBY:
    let LOBBY = LOBBIES[0];

    // When Joining a Lobby
    if(msg.actnName === "join"){
      if(LOBBY.CLIENTS.length === 0){ // First Client
        if(checkForClient(LOBBY,msg.actnUsername) === -1){
          LOBBY.CLIENTS.push(ws);
          LOBBY.USERS.push(msg.actnUsername);
          LOBBY.CLIENTS[0].send(JSON.stringify({ 
            actnName:'load-player-one', 
            actnIndex:LOBBY.CLIENTS.length -1, 
            actnPlayerNumber:1, 
            actnTarget:'player', 
            actnUsername:msg.actnUsername}));
        }
      } else if(LOBBY.CLIENTS.length === 1 && checkForClient(LOBBY,msg.actnUsername) === -1){ // Second Client
        LOBBY.CLIENTS.push(ws);
        LOBBY.USERS.push(msg.actnUsername);
        console.log(LOBBY.USERS);
        LOBBY.CLIENTS[1].send(JSON.stringify({
          actnName:'load-player-two',
          actnIndex:LOBBY.CLIENTS.length -1,
          actnPlayerNumber:2,
          actnTarget:'player',
          actnUsername:msg.actnUsername
        }));
      }else if(LOBBY.CLIENTS.length > 1 && checkForClient(LOBBY,msg.actnUsername) === -1){
        LOBBY.CLIENTS.push(ws);
        LOBBY.USERS.push(msg.actnUsername);
        console.log(LOBBY.USERS);
        LOBBY.CLIENTS[LOBBY.CLIENTS.length-1].send(JSON.stringify({
          actnName:'spectater',
          actnIndex:LOBBY.CLIENTS.length - 1,
          actnUsername:msg.actnUsername
        }));
      }
    } else if(msg.actName === "leave"){
      let userIndex = checkForClient(LOBBY,msg.actnUsername);
      if(userIndex !== -1){
        LOBBY.USERS.splice(userIndex,1);
        LOBBY.CLIENTS.splice(userIndex,1);
      }
    } else if(msg.actnName === "server-tap"){
      // DO NOTHING, THIS IS FINE
    } else{
      sendAll(LOBBY,message, ws);
    }
  });
});

const sendAll = (lobby, message, sender) => {
  for(var i=0; i<lobby.CLIENTS.length;i++){
    if(lobby.CLIENTS[i] !== sender) lobby.CLIENTS[i].send(message);
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

const checkForClient = (lobby, username) => {
  for(let i = 0; i < lobby.USERS.length; i++){
    if(lobby.USERS[i] === username) return i;
  }

  return -1;
}