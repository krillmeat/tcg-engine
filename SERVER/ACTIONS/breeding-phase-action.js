const breedingPhaseAction = (action, LOBBY, ws) => {

   let player = action.actnPlayer;

   sendAll(LOBBY, JSON.stringify({
      actnName: 'update-phase',
      actnPlayer: player,
      actnValue: 'breeding'
   }));

}

module.exports = breedingPhaseAction;
