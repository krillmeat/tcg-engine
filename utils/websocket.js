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

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, '../src', 'index.js'));
// });
app.use(express.static(path.join(__dirname,"..","build")));

http.listen(process.env.PORT || 5000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});

const webSocketServer = new WebSocket.Server({server: http});
webSocketServer.on('connnection', function connection(ws) {
  ws.on('message', function incoming(data) {
    webSocketServer.clients.forEach(function each(client) {
      console.log("CLIENT = ",client);
      if(client !== ws && client.readyState === WebSocket.OPEN){
        client.send(data);
      }
    })
  })
});

window.addEventListener('keydown', e =>{
  if(e.key === 'p'){
    console.log("P!");
  } else{ console.log(e.key); }
})