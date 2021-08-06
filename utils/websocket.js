var express = require('express');
var app = express();
const path = require('path');
var http = require('http').createServer(app);
const WebSocket = require('ws');
const mysql = require('mysql');
let CLIENTS = [];
let testCLIENTS = [];

app.use(express.static(path.join(__dirname,"..","non-react")));

http.listen(process.env.PORT || 5000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});

let webSocketServer = new WebSocket.Server({server: http});

webSocketServer.on('connection', function(ws){

  console.log("BASE");

  CLIENTS.push(ws);

  console.log("CLIENTS IS "+CLIENTS.length+" LONG");

  // ws.on('request',function(request){
  //   console.log("REQUEST RECEIVED");
  //   let connection = request.accept(null, request.origin);
  //   let index = CLIENTS.push(connection) -1;
  //   if(index === 0) {
  //     CLIENTS[index].send({actnName:'host',actnTarget:'player'});
  //   } else if(index === 1){
  //     CLIENTS[index].send({actnName:'player-two',actnTarget:'player'});
  //   } else{ CLIENTS[index].send({actName:'spectator',actionTarget:'player'})}
  // })
  
  ws.on('message',function(message) {
    let msg = JSON.parse(message);
    console.log('received: %s', message);
    console.log("Message is type =",typeof msg);
    console.log("Message Name = ",msg.actnName);
    console.log("Check message match = ",msg.actName === "join");
    if(msg.actName === "join"){
      console.log("JOINING " + CLIENTS.length);
      if(CLIENTS.length === 1){
        CLIENTS[0].send("Hi");
      } else{
        CLIENTS[0].send("You're not first...");
      }
    }
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