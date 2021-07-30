const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({port: 3030});

WSH.ConnectObject('connnection', function connection(ws) {
  ws.on('message', function incoming(data) {
    webSocketServer.clients.forEach(function each(client) {
      if(client !== ws && client.readyState === WebSocket.OPEN){
        client.send(data);
      }
    })
  })
})