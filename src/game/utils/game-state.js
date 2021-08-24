export const buildInitialGameState = (playerOneDeck, playerTwoDeck) => {
  let gameState = {
    turnNumber: 0,
    memory: 0,
    players: [{
        username: 'one',
        deck: playerOneDeck[1],
        breedingDeck: playerOneDeck[0],
        hand: [],
        trash: []
      },
      {
        username: 'two',
        deck: playerTwoDeck[1],
        breedingDeck: playerTwoDeck[0],
        hand: [],
        trash: []
      }]
  };
  return gameState;
}