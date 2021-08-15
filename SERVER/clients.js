class Clients {
  constructor(){
    this._clientList = {};
    this.saveClient = this.saveClient.bind(this);
  }

  saveClient(username, client){
    this.clientList[username] = client;
  }

  get clientList(){
    return this._clientList;
  }
}