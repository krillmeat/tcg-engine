const { sendAll, getOpponentNumber } = require("../utils.js");
const setupAction = require("../ACTIONS/setup-action.js");

/**----------------------------------------------------------------------------------
 * END PHASE ACTION
 * ----------------------------------------------------------------------------------
 * Action for Ending the Current Phase
 * Handles the Logic for setting up the next Phase
 * ----------------------------------------------------------------------------------
 * @param {Object}    action  Message from the Client 
 * @param {Object}    LOBBY   LOBBY Object
 * @param {WebSocket} ws      WebSocket Connection for Client
 *----------------------------------------------------------------------------------*/
const endPhaseAction = (action, LOBBY, ws) => {
    let phase = action.actnValue;
    let player = action.actnPlayer;
    let mockAction = {};
    
    switch(phase){
      case 'setup':
        if(player === LOBBY.GAME_STATE.firstPlayer){ // If the first player is ending their setup
            LOBBY.GAME_STATE.currentPlayer = getOpponentNumber(player);
            mockAction = {actnName: 'going-first', actnPlayer: LOBBY.GAME_STATE.currentPlayer, actnRunner: 'server'};
            setupAction(mockAction, LOBBY, ws);
        } else{ // Second player is ending their setup
            LOBBY.GAME_STATE.turn = 1;
            LOBBY.GAME_STATE.currentPlayer = getOpponentNumber(player);
            LOBBY.GAME_STATE.currentPhase = 'unsuspend';
            mockAction = {actnName: 'unsuspend-phase', actnPlayer: LOBBY.GAME_STATE.currentPlayer, actnRunner: 'server'};
            unsuspendPhaseAction(mockAction, LOBBY, ws);
        }
        break;
      case 'unsuspend':
        LOBBY.GAME_STATE.currentPhase = 'draw';
        mockAction = {actnName: 'draw-phase', actnPlayer: player, actnRunner: 'server'};
        drawPhaseAction(mockAction, LOBBY, ws);
        break;
      case 'draw':
        LOBBY.GAME_STATE.currentPhase = 'breeding';
        mockAction = {actnName: 'breeding-phase', actnPlayer: player, actnRunner: 'server', actnValue:'start'};
        breedingPhaseAction(mockAction, LOBBY, ws);
        break;
      case 'breeding':
        LOBBY.GAME_STATE.currentPhase = 'main';
        mockAction = {actnName: 'main-phase', actnPlayer: player, actnRunner: 'server'};
        mainPhaseAction(mockAction, LOBBY, ws);
        break;
      default:
        console.log("End Phase Action not Found...");
        break;
    }
}

module.exports = endPhaseAction;

// These have to be down here, because otherwise there is circular logic
//   endPhaseAction -> unsuspendPhaseAction -> endPhaseAction
const breedingPhaseAction = require("./breeding-phase-action.js");
const unsuspendPhaseAction = require("./unsuspend-phase-action.js");
const mainPhaseAction = require("./main-phase-action.js");
const drawPhaseAction = require("./draw-phase-action.js");
