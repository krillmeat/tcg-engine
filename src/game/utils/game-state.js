export const buildInitialGameState = () => {
  let gameState = {
    turnNumber: 0,
    players: [{
        username: 'one',
        deck: [],
        breedingDeck: [],
        hand: [],
        trash: []
      },
      {
        username: 'one',
        deck: [],
        breedingDeck: [],
        hand: [],
        trash: []
      }]
  };
  return gameState;
}