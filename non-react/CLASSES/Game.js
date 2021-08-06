class Game {
  constructor(username, ws){
    this._server = ws || new Server(username);
    this.server.ws.onopen = () => { this.onOpen() };
    this.server.ws.onmessage = message => { this.onMessage(message) };
    this.server.ws.onclose = () => { this.onClose() };

    this._memoryGauge = new MemoryGauge(getById('memory-gauge'));

    this._playerDeck;
    this._playerHand = new Hand(getById('player-hand'));
    this._playerSecurity = new Security(getById('player-security'));

    this._opponentDeck;
    this._opponentHand = new Hand(getById('opponent-hand'));
    this._opponentSecurity = new Security(getById('opponent-security'));

    this._actionQueue = [];

    this._gameTimerCounter = 0;
    this._gameTimer = setInterval(()=>{
      if(this.actionQueue.length > 0){
        this.runAction(this.actionQueue[0]);
        this.actionQueue.splice(0,1);
      } else{
        this._gameTimerCounter++;
        if(this._gameTimerCounter %16 === 0) this.runAction({actnName:'server-tap'});
        if(this._gameTimerCounter %32 === 0) this.runAction({actnName:'state-update'});
      }
    }, 250);

    document.querySelector("button.start-button").addEventListener("click",() => {
      this.startGame();
    });
  }

  startGame(){
    this.actionQueue = [{actnName:'shuffle-deck',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},
    {actnName:'restore',actnTarget:'player'},{actnName:'restore',actnTarget:'player'},{actnName:'restore',actnTarget:'player'},{actnName:'restore',actnTarget:'player'},{actnName:'restore',actnTarget:'player'}];
  }

  runAction(action){
    let actnName = action.actnName;
    let actnTarget = action.actnTarget;

    switch (actnName){
      case 'host':
        logServer("You are the host!");
        // THIS NEEDS TO BE DONE DYNAMICALLY
        this.playerDeck = new Deck(getById('player-deck'),0,starterDeckOne[1]);
        this.opponentDeck = new Deck(getById('opponent-deck'),0,starterDeckTwo[1]);
        break;
      case 'player-two':
        logServer("You are player two! Starting the game...");
        this.playerDeck = new Deck(getById('player-deck'),0,starterDeckTwo[1]);
        this.opponentDeck = new Deck(getById('opponent-deck'),0,starterDeckOne[1]);
        this.startPhaseAction(actnTarget);
        break;
      case 'draw':
        this.drawAction(actnTarget);
        break;
      case 'shuffle-deck':
        let deck = action.actnDeck || undefined;
        this.shuffleDeckAction(actnTarget,deck);
        break;
      case 'restore':
        this.restoreAction(actnTarget);
        break;
      case 'server-tap':
        this._server.sendMessage({actnName:'server-tap'});
        break;
      case 'start-phase':
        this.startPhaseAction(actnTarget);
        break;
      case 'unsuspend-phase':
        console.log("UNSUSPEND PHASE");
        break;
      case 'server-tap':
        this.server.sendMessage({actnName:'server-tap'});
        break;
      default:
        logWarning(`WARNING: Game Action not found => ${actnName}`);
        break;
    }
  }

  drawAction(target){
    let drawnCard = this[target+'Deck'].cards[0];
    this[target+'Deck'].drawCard();
    this[target+'Hand'].drawCard(drawnCard);

    if(target === 'player') this._server.sendMessage({actnName:'draw',actnTarget:'opponent'})
  }

  restoreAction(target){
    let drawnCard = this[target+'Deck'].cards[0];
    this[target+'Deck'].drawCard();
    this[target+'Security'].restore(drawnCard);

    if(target === 'player') this._server.sendMessage({actnName:'restore',actnTarget:'opponent'})
  }

  shuffleDeckAction(target, preShuffled){
    // You want to make sure both players get the same shuffle, so send the shuffle in action
    if(preShuffled){
      for(let i = 0; i < this[target+'Deck'].cards.length; i++){
        this[target+'Deck'].cards[i].cardNumber = preShuffled[i];
      }
    } else{
      this[target+'Deck'].shuffle();
      this[target+'Deck'].shuffle();

      let shuffledCardList = [];
      for(let i = 0; i < this[target+'Deck'].cards.length; i++){
        shuffledCardList.push(this[target+'Deck'].cards[i].cardNumber);
      }
      if(target === 'player') this.server.sendMessage({actnName:'shuffle-deck',actnTarget:'opponent',actnDeck:shuffledCardList})
    }
    
  }

  startPhaseAction(target){
    logNote("START PHASE");
    if(target === 'player'){ this.startGame() }
  }

  onOpen(){
      logServer('WS - Open => ',this.server.username);
      this.server.sendMessage({
        actnName: 'join',
        actnUsername: this.server.username
      });
  }

  onMessage(message){
    let msg = JSON.parse(message.data);
    logServer('WS - Message => ',msg);

    this.runAction(msg);

    // let action = msg.actnName;
    // switch(action){
    //   case 'host':
    //     logServer("You are the host!");
    //     break;
    //   case 'player-two':
    //     logServer("You are player 2! Time to start the game!");
    //     // start game
    //     this.startGame();
    //     break;
    //   case 'server-tap':
    //     // this.server.sendMessage({actnName:'server-tap'});
    //     break;
    //   default:
    //     logWarning(`WARNING: Server Action not found => ${action}`);
    //     break;
    // }
  }

  onClose(){
    logServer('WS - Closed => ',this.server.username);
    this.server.ws.sendMessage({
      actnName: 'leave',
      actnUsername: this.server.username
    });
  }


  get server(){ return this._server }

  get actionQueue(){ return this._actionQueue }
  set actionQueue(newQueue){ this._actionQueue = newQueue }

  get playerDeck(){ return this._playerDeck }
  set playerDeck(newDeck) { this._playerDeck = newDeck }
  get playerHand(){ return this._playerHand }
  get playerSecurity(){ return this._playerSecurity }

  get opponentDeck(){ return this._opponentDeck }
  set opponentDeck(newDeck) { this._opponentDeck = newDeck }
  get opponentHand(){ return this._opponentHand }
  get opponentSecurity(){ return this._opponentSecurity }
}