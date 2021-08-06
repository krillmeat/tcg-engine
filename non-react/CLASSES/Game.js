class Game {
  constructor(playerOne, playerTwo){
    this._playerOne = playerOne;
    this._playerTwo = playerTwo;

    this._memoryGauge = new MemoryGauge(getById('memory-gauge'));

    this._playerDeck = new Deck(getById('player-deck'),0,starterDeckOne[1]);
    this._playerHand = new Hand(getById('player-hand'));
    this._playerSecurity = new Security(getById('player-security'));

    this._opponentDeck = new Deck(getById('opponent-deck'),1,starterDeckTwo[1]);
    this._opponentHand = new Hand(getById('opponent-hand'));
    this._opponentSecurity = new Security(getById('opponent-security'));

    this._actionQueue = [];
    this._gameTimer = setInterval(()=>{
      if(this.actionQueue.length > 0){
        this.runAction(this.actionQueue[0]);
        this.actionQueue.splice(0,1);
      }
    }, 250);

    this.startGame();
  }

  startGame(){
    this.actionQueue = [{actnName:'shuffle-deck',actnTarget:'player'}, {actnName:'shuffle-deck',actnTarget:'opponent'},
                        {actnName:'draw',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},
                        {actnName:'draw',actnTarget:'opponent'},{actnName:'draw',actnTarget:'opponent'},{actnName:'draw',actnTarget:'opponent'},{actnName:'draw',actnTarget:'opponent'},{actnName:'draw',actnTarget:'opponent'},
                        {actnName: 'restore',actnTarget:'player'},{actnName: 'restore',actnTarget:'player'},{actnName: 'restore',actnTarget:'player'},{actnName: 'restore',actnTarget:'player'},{actnName: 'restore',actnTarget:'player'},
                        {actnName: 'restore',actnTarget:'opponent'},{actnName: 'restore',actnTarget:'opponent'},{actnName: 'restore',actnTarget:'opponent'},{actnName: 'restore',actnTarget:'opponent'},{actnName: 'restore',actnTarget:'opponent'}]; // Put starting game actions here
  }

  runAction(action){
    let actnName = action.actnName;
    let actnTarget = action.actnTarget;

    switch (actnName){
      case 'draw':
        this.drawAction(actnTarget);
        break;
      case 'shuffle-deck':
        this.shuffleDeckAction(actnTarget);
        break;
      case 'restore':
        this.restoreAction(actnTarget);
        break;
      default:
        logWarning('!! Action not found');
        break;
    }
  }

  drawAction(target){
    let drawnCard = this[target+'Deck'].cards[0];
    this[target+'Deck'].drawCard();
    this[target+'Hand'].drawCard(drawnCard);
  }

  restoreAction(target){
    let drawnCard = this[target+'Deck'].cards[0];
    this[target+'Deck'].drawCard();
    this[target+'Security'].restore(drawnCard);
  }

  shuffleDeckAction(target){
    this[target+'Deck'].shuffle();
    this[target+'Deck'].shuffle();
  }



  get actionQueue(){ return this._actionQueue }
  set actionQueue(newQueue){ this._actionQueue = newQueue }

  get playerDeck(){ return this._playerDeck }
  get playerHand(){ return this._playerHand }
  get playerSecurity(){ return this._playerSecurity }
  get opponentDeck(){ return this._opponentDeck }
  get opponentHand(){ return this._opponentHand }
  get opponentSecurity(){ return this._opponentSecurity }
}