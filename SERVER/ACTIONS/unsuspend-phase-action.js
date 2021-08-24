const {sendAll} = require('../utils.js');
const endPhaseAction = require('../ACTIONS/end-phase-action.js');

const unsuspendPhaseAction = (action,LOBBY,ws) => {
    let player = action.actnPlayer;

    sendAll(LOBBY, JSON.stringify({
        actnName: 'update-phase',
        actnPlayer: player,
        actnValue: 'unsuspend'
    }));

    // TODO - Go through and unsuspend all of player's suspended DGMN

    // TODO - Go through and unsuspend all of opponent's suspended DGMN with Reboot

    // TEMPORARY SKIP TO BREEDING:
    let mockAction = {actnName: 'phase-complete', actnPlayer: player, actnValue: 'unsuspend'};
    endPhaseAction(mockAction, LOBBY, ws);

}

module.exports = unsuspendPhaseAction;