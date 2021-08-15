let {sendAll} = require('../utils.js');
const Deck = require('../CLASSES/deck.js');
const Card = require('../CLASSES/card.js');

const loadDeckAction = (action, LOBBY, ws) => {
  let deckList = action.actnValue[1];
  let playerNumber = action.actnPlayer;

  LOBBY.GAME_STATE.players[playerNumber-1].deck = buildDeck(deckList);

  ws.send(JSON.stringify({
    actnName:'notify',
    actnMessage:'Deck has been loaded...'
  }));
}

const buildDeck = (deckList) => {
  let constructedDeck = new Deck();

  for(let card of deckList){
    constructedDeck.addCard(new Card(card));
  }

  return constructedDeck;
}

module.exports = loadDeckAction;