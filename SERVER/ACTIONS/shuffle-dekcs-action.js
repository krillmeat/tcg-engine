const shuffleDecksAction = (action, LOBBY, ws) => {
    let playerNumber = action.actnPlayer;

    LOBBY.GAME_STATE.players[playerNumber-1].deck.shuffle(2);
    LOBBY.GAME_STATE.players[playerNumber-1].breedingDeck.shuffle(1);

    ws.send(JSON.stringify({
        actnName:'shuffle-decks',
        actnMessage:'Decks have been shuffled...'
    }));
};

module.exports = shuffleDecksAction;