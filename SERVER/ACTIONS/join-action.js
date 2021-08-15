let {sendAll} = require('../utils.js');

/**----------------------------------------------------------------------------------
 * JOIN ACTION
 * ----------------------------------------------------------------------------------
 * When a person joins the WebSocket Server, this function will decide whether they
 * join as Player 1, Player 2, or as a spectator
 * ----------------------------------------------------------------------------------
 * @param {Object}    action  Message from the client 
 * @param {Object}    LOBBY   Lobby Object that contains all of the data
 * @param {WebSocket} ws      WebSocket Connection for the Client
 * --------------------------------------------------------------------------------*/
const joinAction = (action, LOBBY, ws) => {
  if(LOBBY.CLIENTS.length === 0 && checkForClient(LOBBY,action.actnUsername) === -1) {
    LOBBY.CLIENTS.push(ws);                             // Add the Client Connection to the CLIENT list
    LOBBY.USERS.push(action.actnUsername);              // Add the User to the list
    LOBBY.GAME_STATE.addPlayer(action.actnUsername);    // Create a new Player and add them to the Game

    // Inform Client that they have Joined the Game as Player One
    LOBBY.CLIENTS[0].send( JSON.stringify({
      actnName: 'set-player-number',
      actnMessage: 'You are Player 1',
      actnValue: 1
    }) );

  } else if(LOBBY.CLIENTS.length === 1 && checkForClient(LOBBY,action.actnUsername) === -1){
    LOBBY.CLIENTS.push(ws);                             // Add the Client Connection to the CLIENT list
    LOBBY.USERS.push(action.actnUsername);              // Add the User to the list
    LOBBY.GAME_STATE.addPlayer(action.actnUsername);    // Create a new Player and add them to the Game

    // Inform Client that they have Joined the Game as Player One
    LOBBY.CLIENTS[1].send( JSON.stringify({
      actnName: 'set-player-number',
      actnMessage: 'You are Player 2',
      actnValue: 2
    }) );

    sendAll(LOBBY, JSON.stringify({
      actnName: 'players-ready',
      actnMessage: 'Both Players have joined the Game, get ready to start!'
    }));

  } else{ // SPECTATOR, DO NOT DO ANYTHING YET

    // TODO - Allow Spectators

    LOBBY.CLIENTS[LOBBY.CLIENTS.length-1].send( JSON.stringify({
      actName:'reject-connection',
      actnMessage: 'Too many people have joined the game already :C'
    }))
  }
}

/**----------------------------------------------------------------------------------
 * CHECK FOR CLIENT
 * ----------------------------------------------------------------------------------
 * Checks the list of existing Users to see if they've already joined the lobby and
 * are rejoining. Mostly a failsafe for if a User loses connection for some reason
 * ----------------------------------------------------------------------------------
 * @param {Object} LOBBY 
 * @param {String} username 
 * @returns Index of Client (-1 for not found)
 * --------------------------------------------------------------------------------*/
const checkForClient = (LOBBY, username) => {
  for(let i = 0; i < LOBBY.USERS.length; i++){
    if(LOBBY.USERS[i] === username) return i;
  }
  return -1;
}

module.exports = joinAction;