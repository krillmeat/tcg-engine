function logServer(message,object){
  let obj = object || '';
  console.log(`%c ${message}%o`,'color: #FD971F',obj)
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