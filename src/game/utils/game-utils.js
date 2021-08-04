export const shuffleCards = cardList => {
  gameLog("Shuffling Deck...");
  for(var i = cardList.length -1; i > 0; i--){
    var j = Math.floor(Math.random()* (i+1));
    var temp = cardList[i];
    cardList[i] = cardList[j];
    cardList[j] = temp;
  }
  // console.log("SHUFFLED DECK = ",cardList);
  return cardList;
}

export const getSet = setData => {
  return setData.split("-")[0];
}

export const getSetNumber = setData => {
  let split = setData.split("-")[1];
  return parseInt(split);
}

export const gameLog = logMessage => {
  console.log(`%c ${logMessage}`,'color: #999999');
}