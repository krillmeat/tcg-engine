const { sendAll } = require('../utils.js');

const mainPhaseAction = (action, LOBBY, ws) => {
  
  let player = action.actnPlayer;

  sendAll(LOBBY, JSON.stringify({
    actnName: 'update-phase',
      actnPlayer: player,
      actnValue: 'main',
      actnData: {
        hand: LOBBY.GAME_STATE.players[player-1]._hand
      }
  }))
}

module.exports = mainPhaseAction;