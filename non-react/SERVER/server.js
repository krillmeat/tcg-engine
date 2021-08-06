class Server {
  constructor(username){
    this._username = username;
    this._URL = 'wss://tcg-engine.herokuapp.com';
    // this._URL = 'ws://localhost:5000';
    this._ws = new WebSocket(this._URL);   
  }

  sendMessage(message){
    this._ws.send(JSON.stringify(message));
  }

  get username(){ return this._username }

  get ws(){ return this._ws }
}