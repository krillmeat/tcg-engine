function logServer(message,object){
  object ? console.log(`%c ${message}%o`,'color: #FD971F',object) : console.log(`%c ${message}`,'color: #FD971F');
}

function sendAll(lobby,message){
  for(var i=0; i<lobby.CLIENTS.length;i++){
    lobby.CLIENTS[i].send(message);
  }
}

function generateId(){
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

module.exports = {sendAll, generateId}