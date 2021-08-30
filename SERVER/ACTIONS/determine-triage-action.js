const cardsDB = require('../DATA/cards.db.js')

const determineTriageAction = (action, LOBBY, ws) => {
  let player = action.actnPlayer;

  let card = LOBBY.GAME_STATE.players[player-1]._hand.findCardById(action.actnValue);
  let cardData = cardsDB[card._cardNumber.split("-")[0]][parseInt(card._cardNumber.split("-")[1])-1];

  if(cardData.cardType === 'digimon'){
    console.log("Triage for digimon");

    let dgmnLevel = cardData.level;

    ws.send(JSON.stringify({
      actnName: 'set-triage-card',
      actnPlayer: player,
      actnData: cardData
    }))

    // TODO - Evolve

      // Hunt for dgmn in breeding zone and battlefield that are one level less
  
    // TODO - Play to Field

      // Send message to focus battlefield elem
      ws.send(JSON.stringify({
        actnName: 'activate',
        actnPlayer: player,
        actnValue: 'play-dgmn-to-field',
        actnData: {cost: cardData.cost}
      }));

  } else if(cardData.cardType === 'option'){
    console.log("Triage for Option");
  } else if(cardData.cardType === 'tamer'){
    console.log("Triage for Tamer");
  }
}

module.exports = determineTriageAction;