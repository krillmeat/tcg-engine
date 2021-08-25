function logNote(message,object){
  if(showNotes) {
    object ? console.log(`%c ${message}%o`,'color: #75715E',object) : console.log(`%c ${message}`,'color: #75715E')
  }
}

function logWarning(message){
  console.log(`%c ${message}`,'color: #E6DB74')
}

function logDebug(message){
  if(showDebug) console.log(`%c ${message}`,'color: #A6E22E')
}

function logServer(message,object){
  object ? console.log(`%c ${message}%o`,'color: #FD971F',object) : console.log(`%c ${message}`,'color: #FD971F');
}

function getById(idName){
  return document.getElementById(idName);
}

function getParamIndex(paramList,paramMatch){
  for(let i = 0; i < paramList.length; i++){
    if(paramList[i].split("=")[0] === paramMatch){
      return i;
    }
  }
  return -1;
}

function getOpponentNumber(playerNo){
  return playerNo === 1 ? 2 : 1;
}


function getIndex(node) {
  var children = node.parentNode.querySelectorAll("li");
  for (i = 0; i < children.length; i++) {
    if (node === children[i]) break;
  }
  return i;
}

function getCardSet(cardNumber){
  return cardNumber.split("-")[0];
}

function getCardNumber(cardNumber){
  return parseInt(cardNumber.split("-")[1])-1;
}