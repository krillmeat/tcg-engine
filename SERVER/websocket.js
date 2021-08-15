let GameState = require("./CLASSES/game-state.js");

let joinAction = require("./ACTIONS/join-action.js");

var express = require('express');
var app = express();
const path = require('path');
var http = require('http').createServer(app);
const WebSocket = require('ws');
const loadDeckAction = require("./ACTIONS/load-deck-action.js");
// const mysql = require('mysql');

app.use(express.static(path.join(__dirname,"..","non-react"))); // Attach the HTML Page to this file/server

// Set up everything on the correct port
http.listen(process.env.PORT || 5000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});

let webSocketServer = new WebSocket.Server({server: http}); // Make a WebSocket Server

let LOBBIES = []; // For the future, when I want to be able to have multiple lobbies at a time

webSocketServer.on('connection', function(ws){

  if(LOBBIES.length === 0){
    LOBBIES.push({
      LOBBY_ID: Math.floor(Math.random() * 1000),
      CLIENTS: [],
      USERS: [],
      GAME_STATE: new GameState()
    })

    console.log("Initialized Game State = ",LOBBIES[LOBBIES.length-1].GAME_STATE);
  }
  
  ws.on('message',function(message) {
    let msg = JSON.parse(message);

    // FOR NOW, JUST JOIN THE ONLY LOBBY:
    let LOBBY = LOBBIES[0];

    actionHandler(msg, LOBBY, ws);
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






// ACTION HANDLER
const actionHandler = (action, lobby, ws) =>{
  let actnName = action.actnName;
  switch(actnName){
    case 'join':
      joinAction(action,lobby,ws);
      break;
    case 'load-deck':
      loadDeckAction(action, lobby, ws);
      break;
    default:
      console.log(`Could not find Action "${actnName}" on Server...`);
      break;
  }
}