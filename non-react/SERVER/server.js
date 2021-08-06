let username = "krillmeat";

const URL = 'wss://tcg-engine.herokuapp.com';
// const URL = 'ws://localhost:5000';

let ws = new WebSocket(URL);
    ws.onopen = () => {
      let id = username; // Todo - Make this attach to username from login
      console.log("WS - Open = "+username);
      ws.send({
        actnName: 'join',
        actionTarget: id
      });
    }

    ws.onmessage = message => {
      console.log("MESSAGE = ",message);
      let action = message.actionName;
      switch(action){
        case 'host':
          console.log("YOU ARE THE HOST!");
          break;
        default:
          logWarning('WARNING: Action not found');
          break;
      }
    }