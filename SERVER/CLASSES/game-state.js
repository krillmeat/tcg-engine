const Player = require("./player");

class GameState {
  constructor(){
    this._players = [];
    this._turn = 0;
    this._phase = 'prologue';
  }

  /**----------------------------------------------------------------------------------
   * ADD PLAYER
   * ----------------------------------------------------------------------------------
   * @param {String} player Username of the Player Joining the Game
   * --------------------------------------------------------------------------------*/
  addPlayer(username){
    console.log(`Adding ${username} to game`);
    this.players.push(new Player(username));
  }

  get players(){ return this._players }
  set players(newPlayers){ this._players = newPlayers }

  get turn(){ return this._turn }
};

module.exports = GameState;