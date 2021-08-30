const {sendAll} = require("../utils.js");

const drawPhaseAction = (action, LOBBY, ws) => {
  let player = action.actnPlayer;

  let drawnCards = LOBBY.GAME_STATE.players[player -1].deck.drawCards(1);
  LOBBY.GAME_STATE.players[player -1].hand.addCards(drawnCards);

  sendAll(LOBBY, JSON.stringify({
    actnName: 'update-phase',
    actnPlayer: player,
    actnValue: 'draw'
  }));

  sendAll(LOBBY, JSON.stringify({
    actnName: 'draw-cards',
    actnPlayer: player,
    actnData: drawnCards,
    actnMessage: "Drawing Cards..."
  }));
}

module.exports = drawPhaseAction;