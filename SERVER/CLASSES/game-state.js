const Player = require("./player");

class GameState {
  constructor(){
    this._players = [];
    this._turn = 0;
    this._currentPlayer = 0;
    this._phase = 'prologue';
    this._firstPlayer = 0;
    this._memory = 0;
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

  get phase(){ return this._phase }
  set phase(newPhase){ this._phase = newPhase }

  get currentPlayer(){ return this._currentPlayer }
  set currentPlayer(newCurrentPlayer){ this._currentPlayer = newCurrentPlayer }

  get firstPlayer(){ return this._firstPlayer }
  set firstPlayer(newFirstPlayer){ this._firstPlayer = newFirstPlayer }

  get memory(){ return this._memory }
  set memory(newMemory){ this._memory = newMemory }
};

module.exports = GameState;