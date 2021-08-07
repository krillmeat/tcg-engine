class Game {
  constructor(username, ws){
    this._server = ws || new Server(username);
    this.server.ws.onopen = () => { this.onOpen() };
    this.server.ws.onmessage = message => { this.onMessage(message) };
    this.server.ws.onclose = () => { this.onClose() };

    this._memoryGauge = new MemoryGauge(getById('memory-gauge'));
    this._currentPhase = 'none';
    this._currentPlayer = 0;

    this._playerNumber = 0;

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

    document.querySelector("button.start-button").addEventListener("click",e => {
      // this.startGame();
      this.playerDeck = new Deck(getById('player-deck'),0,starterDeckTwo[1]);
      this.opponentDeck = new Deck(getById('opponent-deck'),0,starterDeckOne[1]);
      this.setupPhaseAction(this.playerNumber);
      e.target.style.top = "-1000px";
    });
  }

  runAction(action){
    let actnName = action.actnName;
    let actnTarget = action.actnTarget;

    switch (actnName){
      case 'load-player-one':
        // THIS NEEDS TO BE DONE DYNAMICALLY
        this.playerNumber = 1;
        logServer("You are Player "+this.playerNumber);
        this.playerDeck = new Deck(getById('player-deck'),0,starterDeckOne[1]);
        this.opponentDeck = new Deck(getById('opponent-deck'),0,starterDeckTwo[1]); // Figure out how to SEND this over after this is over
        break;
      case 'load-player-two':
        this.playerNumber = 2;
        logServer("You are Player "+this.playerNumber);
        document.querySelector('button.start-button').classList.add('reveal');
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
      case 'end-phase':
        this.endPhaseAction();
        break;
      case 'begin-game-phase':
        console.log("BEGIN THE DANG GAME!!");
        break;
      case 'setup-phase':
        this.setupPhaseAction(actnTarget);
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

  endPhaseAction(){
    console.log("ENDING PHASE = "+this.currentPhase+" : "+this.playerNumber);
    switch(this.currentPhase){
      case 'setup-phase':
        if(this.playerNumber === 2){
          this.server.sendMessage({actnName:'setup-phase',actnTarget:getOpponentNumber(this.playerNumber)});
        } else{
          this.runAction({actnName:'begin-game-phase'});
        }
        break;
      default:
        logWarning(`WARNING: No matching phase...`);
        break;
    }
  }

  setupPhaseAction(playerNo){
    logNote("SETUP PHASE -- Player "+playerNo);
    this.currentPhase = 'setup-phase';
    this._currentPlayer = playerNo;
    
    this.actionQueue = [{actnName:'shuffle-deck',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},{actnName:'draw',actnTarget:'player'},
                        {actnName:'restore',actnTarget:'player'},{actnName:'restore',actnTarget:'player'},{actnName:'restore',actnTarget:'player'},{actnName:'restore',actnTarget:'player'},{actnName:'restore',actnTarget:'player'},{actnName:'end-phase'}];
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
    // logServer('WS - Message => ',msg);

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
    this.server.sendMessage({
      actnName: 'leave',
      actnUsername: this.server.username
    });
  }


  get server(){ return this._server }

  get currentPhase(){ return this._currentPhase }
  set currentPhase(newPhase){ this._currentPhase = newPhase }

  get currentPlayer(){ return this._currentPlayer }
  set currentPlayer(newPlayer){ this._currentPlayer = newPlayer }

  get playerNumber(){ return this._playerNumber }
  set playerNumber(newNumber){ this._playerNumber = newNumber }

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