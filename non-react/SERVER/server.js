let username = "krillmeat";

let ws = new WebSocket("ws://localhost:5000");
    ws.onopen = () => {
      let id = username; // Todo - Make this attach to username from login
      console.log("WS - Open = "+username);
    }