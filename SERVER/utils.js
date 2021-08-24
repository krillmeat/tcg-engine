function logServer(message,object){
  object ? console.log(`%c ${message}%o`,'color: #FD971F',object) : console.log(`%c ${message}`,'color: #FD971F');
}

/**----------------------------------------------------------------------------------
 * SEND ALL
 * ----------------------------------------------------------------------------------
 * Send a message from the Server to all of the Clients in a Lobby
 * ----------------------------------------------------------------------------------
 * @param {Object} lobby    LOBBY object
 * @param {Object} message  Message for the Client
 *----------------------------------------------------------------------------------*/
function sendAll(lobby,message){
  for(var i=0; i<lobby.CLIENTS.length;i++){
    lobby.CLIENTS[i].send(message);
  }
}

function generateId(){
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getOpponentNumber(playerNo){
  return playerNo === 1 ? 2 : 1;
}

module.exports = {sendAll, generateId, getOpponentNumber}