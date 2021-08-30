const Dgmn = require('../CLASSES/dgmn.js');
const cardsDB = require('../DATA/cards.db.js');
const { sendAll } = require('../utils.js');

const playDgmnToFieldAction = (action, LOBBY, ws) => {
  let player = action.actnPlayer;

  let card = LOBBY.GAME_STATE.players[player-1]._hand.findCardById(action.actnValue);
  let cardData = cardsDB[card._cardNumber.split("-")[0]][parseInt(card._cardNumber.split("-")[1])-1];

  console.log("Action = ",action);
  console.log("Card = ",card);
  console.log("Card Data = ",cardData);

  LOBBY.GAME_STATE.memory = player === 1 ? cardData.cost : -1 * cardData.cost;

  sendAll(LOBBY, JSON.stringify({
    actnName: 'update-memory',
    actnValue: LOBBY.GAME_STATE.memory
  }));

  let dgmn = new Dgmn(card._cardNumber);

  LOBBY.GAME_STATE.players[player-1]._hand.removeCard(action.actnValue);
  LOBBY.GAME_STATE.players[player-1]._battlefieldDgmn.push(dgmn);

  // Check for on-play action

  sendAll(LOBBY, JSON.stringify({
    actnName: "add-dgmn-to-battlefield",
    actnPlayer: player,
    actnValue: action.actnValue,
    actnData: card._cardNumber
  }))
}

module.exports = playDgmnToFieldAction;