const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({port: 5000});

webSocketServer.on('connnection', function connection(ws) {
  ws.on('message', function incoming(data) {
    webSocketServer.clients.forEach(function each(client) {
      if(client !== ws && client.readyState === WebSocket.OPEN){
        client.send(data);
      }
    })
  })
})