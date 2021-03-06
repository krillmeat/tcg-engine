const { sendAll } = require("../utils");

const setupAction = (action, LOBBY, ws) => {
    let player = action.actnPlayer;
    LOBBY.GAME_STATE.phase = 'setup';

    sendAll(LOBBY, JSON.stringify({
        actnName: 'update-phase',
        actnPlayer: player,
        actnValue: 'setup'
    }));

    // SET FIVE SECURITY CARDS
    let securityCards = LOBBY.GAME_STATE.players[player -1].deck.drawCards(5);
    LOBBY.GAME_STATE.players[player -1].security.addCards(securityCards);

    sendAll(LOBBY, JSON.stringify({
        actnName: 'restore-security',
        actnPlayer: player,
        actnData: securityCards,
        actnMessage: "Restoring Cards..."
    }));

    // DRAW FIVE CARDS
    let drawnCards = LOBBY.GAME_STATE.players[player -1].deck.drawCards(5);
    LOBBY.GAME_STATE.players[player -1].hand.addCards(drawnCards);

    sendAll(LOBBY, JSON.stringify({
        actnName: 'draw-cards',
        actnPlayer: player,
        actnValue: 'setup-phase',
        actnData: drawnCards,
        actnMessage: "Drawing Cards..."
    }));
}

module.exports = setupAction;