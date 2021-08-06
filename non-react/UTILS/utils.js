function logNote(message){
  if(showNotes) console.log(`%c ${message}`,'color: #75715E')
}

function logWarning(message){
  console.log(`%c ${message}`,'color: #E6DB74')
}

function getById(idName){
  return document.getElementById(idName);
}