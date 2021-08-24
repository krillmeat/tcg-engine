const {sendAll} = require('../utils.js');

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

   // Update Phase for Clients 
   sendAll(LOBBY, JSON.stringify({
      actnName: 'update-phase',
      actnPlayer: player,
      actnValue: 'breeding'
   }));

}

module.exports = breedingPhaseAction;
