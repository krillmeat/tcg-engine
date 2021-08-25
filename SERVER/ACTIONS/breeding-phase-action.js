const {sendAll} = require('../utils.js');
const Dgmn = require('../CLASSES/dgmn.js');

/**----------------------------------------------------------------------------------
 * BREEDING PHASE ACTION
 * ----------------------------------------------------------------------------------
 * Action for the Breeding Phase
 * Allows the Following:
 * - Hatch Egg
 * - Promote Breeding DGMN
 * ----------------------------------------------------------------------------------
 * @param {Object}    action  Message from the Client 
 * @param {Object}    LOBBY   LOBBY Object
 * @param {WebSocket} ws      WebSocket Connection for Client
 *----------------------------------------------------------------------------------*/
const breedingPhaseAction = (action, LOBBY, ws) => {

  let player = action.actnPlayer;
  let value = action.actnValue;

   if(value === 'start'){
    // Update Phase for Clients 
    sendAll(LOBBY, JSON.stringify({
      actnName: 'update-phase',
      actnPlayer: player,
      actnValue: 'breeding',
      actnData: {
        deck: LOBBY.GAME_STATE.players[player-1].breedingDeck,
        breedingDgmn: LOBBY.GAME_STATE.players[player-1].breedingDgmn
      }
    }));
   } else if(value === 'hatch'){
    let card = LOBBY.GAME_STATE.players[player-1].breedingDeck._cards[0];
    console.log("Hatched Card Number = ",card);
    let hatchedDgmn = new Dgmn(card._cardNumber);
    LOBBY.GAME_STATE.players[player-1].breedingDgmn = hatchedDgmn;
    LOBBY.GAME_STATE.players[player-1].breedingDeck._cards.splice(0,1);

    sendAll(LOBBY, JSON.stringify({
      actnName: 'hatch-dgmn',
      actnPlayer: player,
      actnData: hatchedDgmn
    }));

   } else if(value === 'promote'){

   }
   
}

module.exports = breedingPhaseAction;
