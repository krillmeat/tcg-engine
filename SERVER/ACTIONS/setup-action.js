const setupAction = (action, LOBBY, ws) => {
    let player = action.actnPlayer;
    LOBBY.GAME_STATE.phase = 'setup';

    console.log("Setup for Player "+player);
}

module.exports = setupAction;