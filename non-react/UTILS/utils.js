function logNote(message){
  if(showNotes) console.log(`%c ${message}`,'color: #75715E')
}

function logWarning(message){
  console.log(`%c ${message}`,'color: #E6DB74')
}

function logDebug(message){
  if(showDebug) console.log(`%c ${message}`,'color: #A6E22E')
}

function logServer(message,object){
  let obj = object || '';
  console.log(`%c ${message}%o`,'color: #FD971F',obj)
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