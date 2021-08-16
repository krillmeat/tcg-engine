const BreedingDeck = require('../CLASSES/breeding-deck.js');
const Card = require('../CLASSES/card.js');

const loadBreedingDeckAction = (action, LOBBY, ws) => {
  let deckList = action.actnValue[1];
  let playerNumber = action.actnPlayer;

  LOBBY.GAME_STATE.players[playerNumber-1].breedingDeck = buildBreedingDeck(deckList);

  ws.send(JSON.stringify({
    actnName:'notify',
    actnMessage:'Breeding Deck has been loaded...'
  }));

};

const buildBreedingDeck = (deckList) => {
  let constructedDeck = new BreedingDeck();

  for(let card of deckList){
    constructedDeck.addCard(new Card(card));
  }

  return constructedDeck;
}

module.exports = loadBreedingDeckAction;