class Game {
  constructor(username, ws){
    this._server = ws || new Server(username);                                      // Object - The WebSocket Server
    this.server.ws.onopen = () => { this.onOpen() };                                // Func   - What happens when the connection to the WS is started
    this.server.ws.onmessage = message => { this.onMessage(message) };              // Func   - What happens when the WS receives a message from the server
    this.server.ws.onclose = () => { this.onClose() };                              // Func   - What happens when the connection to the WS is closed

    this._allowAction = false;                                                      // Bool   - Whether or not actions from the player are currently allowed (might be removed)

    this._phaseMessage = document.querySelector(".phase-message");                  // HTML   - Message Element that pops up when the Phase changes

    this._memoryGauge = new MemoryGauge(getById('memory-gauge'));                   // Object - Memory Gauge

    this._currentPhase = 'none';                                                    // String - Denotes the current Phase of the Game/Turn
    this._currentPlayer = 0;                                                        // Number - Denotes which Player's Turn it currently is

    this._playerNumber = 0;                                                         // Number - Denotes the Player's Number (1 or 2)

    this._playerDeck;
    this._playerHand = new Hand(getById('player-hand'));                            // Object - Player's Hand
    this._playerSecurity = new Security(getById('player-security'));                // Object - Player's Security Stack
    this._playerBreeding = new Breeding(getById('player-breeding'));                // Object - Player's Breeding Area
    this._playerBattleField = new Battlefield(getById('player-battlefield'));       // Object - Player's Battlefield

    this._opponentDeck;
    this._opponentHand = new Hand(getById('opponent-hand'));                        // Object - Opponent's Hand
    this._opponentSecurity = new Security(getById('opponent-security'));            // Object - Opponent's Security Stack
    this._opponentBreeding = new Breeding(getById('opponent-breeding'));            // Object - Opponent's Breeding Area
    this._opponentBattlefield = new Battlefield(getById('opponent-battlefield'));   // Object - Opponent's Battlefield\


    this.playerHandElem = document.getElementById("player-hand");
    this.opponentHandElem = document.getElementById("opponent-hand");

    this.playerSecurityElem = document.getElementById("player-security");
    this.opponentSecurityElem = document.getElementById("opponent-security");




    this._actionQueue = [];

    this.setEventListeners();

    this._gameTimerCounter = 0;
    this._gameTimer = setInterval(()=>{
      if(this.actionQueue.length > 0){
        // this.runAction(this.actionQueue[0]);
        this.runClientAction(this.actionQueue[0]);
        this.actionQueue.splice(0,1);
      } else{
        this._gameTimerCounter++;
        if(this._gameTimerCounter %16 === 0) this.runAction({actnName:'server-tap'});
        if(this._gameTimerCounter %32 === 0) this.runAction({actnName:'state-update'});
      }
    }, 500);

    document.querySelector("button.start-button").addEventListener("click",e => {
      this.playerDeck = new Deck(getById('player-deck'),0,starterDeckTwo[1]);
      this.playerBreeding.breedingDeck = this.playerBreeding.buildDeck(starterDeckTwo[0]);
      this.opponentDeck = new Deck(getById('opponent-deck'),0,starterDeckOne[1]);
      this.opponentBreeding.breedingDeck = this.opponentBreeding.buildDeck(starterDeckOne[0]);
      // this.setupPhaseAction(this.playerNumber);
      this.updatePhaseAction('setup',this.playerNumber);
      e.target.style.top = "-1000px";
    });
  }

  drawAction(player, card){
    let newCardElem = document.createElement("li");
        newCardElem.classList.add("card");
        newCardElem.dataset.cardId = card._cardId;

    if(player === this.playerNumber){ // You are drawing

      newCardElem.innerHTML = `<img src='https://rossdanielconover.com/DGMN_CARDS/CARDS/${getCardSet(card._cardNumber)}/${card._cardNumber}.png'/>`;
      this.playerHandElem.appendChild(newCardElem);

      // Drawing Ends Both the Setup and Draw Phases
      if(this.currentPhase === 'setup'){
        if(this.playerHandElem.querySelectorAll("li").length === 5){
          setTimeout(() => {
            this.server.sendMessage({actnName: 'phase-complete', actnPlayer: this.playerNumber, actnValue: 'setup'})
          },1000);
        }
      } else if(this.currentPhase === 'draw'){
        setTimeout(() => {
          this.server.sendMessage({actnName: 'phase-complete', actnPlayer: this.playerNumber, actnValue: 'setup'})
        },1000);
      }
    } else{ // Opponent is Drawing
      newCardElem.innerHTML = "<img src='https://rossdanielconover.com/DGMN_CARDS/card-back.png'/>";
      this.opponentHandElem.appendChild(newCardElem);
    }
  }

  restoreAction(player, card){
    let newCardElem = document.createElement("li");
        newCardElem.classList.add("card");
        newCardElem.dataset.cardId = card._cardId;
        newCardElem.innerHTML = `<img src='https://rossdanielconover.com/DGMN_CARDS/card-back.png'/>`;

    player === this.playerNumber ? this.playerSecurityElem.appendChild(newCardElem) : this.opponentSecurityElem.appendChild(newCardElem);
  }

  // loadDeckAction(target, deckCards){
  //   console.log("Loaded Deck - "+target+" = ",this[target+'Deck'].cards);
  //   console.log("Hand ? ",this[target+'Hand'].cards);
  //   if(deckCards){
  //     this[target+'Deck'].cards = this[target+'Deck'].cloneDeck(deckCards);
  //   } else{
  //     this[target+'Deck'].cards = this[target+'Deck'].createDeck(this[target+'Deck'].decklist);
  //     if(target === 'player') this.server.sendMessage({actnName:'load-deck',actnTarget:'opponent',actionDeckCards:this[target+'Deck'].cards})
  //   }
  // }

  // shuffleDeckAction(target, preShuffled){
  //   // You want to make sure both players get the same shuffle, so send the shuffle in action
  //   if(preShuffled){
  //     for(let i = 0; i < this[target+'Deck'].cards.length; i++){
  //       this[target+'Deck'].cards[i].cardNumber = preShuffled[i];
  //     }
  //   } else{
  //     this[target+'Deck'].shuffle();
  //     this[target+'Deck'].shuffle();

  //     let shuffledCardList = [];
  //     for(let i = 0; i < this[target+'Deck'].cards.length; i++){
  //       shuffledCardList.push(this[target+'Deck'].cards[i].cardNumber);
  //     }
  //     if(target === 'player') this.server.sendMessage({actnName:'shuffle-deck',actnTarget:'opponent',actnDeck:shuffledCardList})
  //   }
  // }

  /**----------------------------------------------------------------------------------
   * HATCH ACTION
   * ----------------------------------------------------------------------------------
   * Hatches an Egg from the Breeding Deck into the Raising Zone
   * ----------------------------------------------------------------------------------
   * @param {String} target 'player' or 'opponent'
   * --------------------------------------------------------------------------------*/
  // hatchAction(target,dgmnId){
  //   let hatched = this[target+'Breeding'].breedingDeck[0];
  //   this[target+'Breeding'].breedingDeck.splice(0,1);
  //   this[target+'Breeding'].currentBreeding = dgmnId ? new Dgmn(hatched.cardNumber,dgmnId) : new Dgmn(hatched.cardNumber);
  //   this[target+'Breeding'].breedingDgmnElem.appendChild(this[target+'Breeding'].currentBreeding.elem);

  //   if(target === 'player'){
  //     this._server.sendMessage({actnName:'hatch',actnTarget:'opponent',actnDgmn:this[target+'Breeding'].currentBreeding.dgmnId});
  //     setTimeout(()=>{this.actionQueue.push({actnName:'update-phase',actnPhase:'main',actnPlayer:this.playerNumber})},2000);
  //   } 
  // }

  /**----------------------------------------------------------------------------------
   * PLAY TRIAGE ACTION
   * ----------------------------------------------------------------------------------
   * When you Click on a Card to play it, it will give you a prompt of where it can be
   * played, depending on what kind of card it is
   * ----------------------------------------------------------------------------------
   * @param {String} target     'player' or 'opponent'
   * @param {String} cardNumber Set Number for the Card (ST1-01)
   * @param {Number} cardIndex  Index number for where the Card is in the Hand 
   * --------------------------------------------------------------------------------*/
  playTriageAction(target,cardNumber, cardIndex){
    let cardData = cardsDB[cardNumber.split("-")[0]][parseInt(cardNumber.substring(2).split("-")[1] - 1)];
    if(cardData.cardType === 'digimon'){

      this[target+'Battlefield'].elem.querySelector('.play-to-field').classList.add('focus');
      let playable = [this[target+'Battlefield'].elem.querySelector('.play-to-field')];

      // Play Directly onto the Battlefield

      this[target+'Battlefield'].elem.querySelector('.play-to-field').addEventListener('click',(e) => {
        let elem = e.currentTarget;
        this.playDigimonToBattlefieldAction(target,cardNumber,cardIndex);
        elem.replaceWith(e.currentTarget.cloneNode(true));
        setTimeout(()=>{let focused = document.getElementById(`${target}-field`).querySelectorAll('.focus');
        for(let focus of focused){
          focus.classList.remove('focus')
        }},1000);
      });

      // Evolve in Raising Area
      let cB = this.playerBreeding.currentBreeding;
      if(cB !== null){
        let breedingData = cardsDB[getCardSet(cB.cardNumber)][getCardNumber(cB.cardNumber)];
        if(cardData.evoCost[breedingData.color] !== null && cardData.level - breedingData.level === 1){
          let currentBreedingElem = this.playerBreeding.elem.querySelector(".current-breeding");
          currentBreedingElem.classList.add('focus');
          playable.push(currentBreedingElem);
          currentBreedingElem.addEventListener('click',(e)=>{
            this.evolveBreedingDigimonAction(target,cardNumber,cB,cardIndex);
            setTimeout(()=>{let focused = document.getElementById(`${target}-field`).querySelectorAll('.focus');
            for(let focus of focused){
              focus.classList.remove('focus')
            }},1000);
          })
        }
      }
      

      // Evolve on Battlefield


      // Handle Memory Gauge Effects on Hover
    }
  }

  playDigimonToBattlefieldAction(target,cardNumber,cardIndex){
    let dgmnData = cardsDB[getCardSet(cardNumber)][getCardNumber(cardNumber)];

    // TODO - Trigger On Play Actions

    // Draw the Dgmn on the Field, and remove the card from your hand
    this[target+'Battlefield'].dgmnList.push(new Dgmn(cardNumber));
    this[target+'Battlefield'].elem.querySelector('.dgmn-zone').appendChild(this[target+'Battlefield'].dgmnList[this[target+'Battlefield'].dgmnList.length-1].elem);
    this[target+'Hand'].cards.splice(cardIndex,1);
    this[target+'Hand'].elem.removeChild(this[target+'Hand'].elem.querySelector(`li:nth-of-type(${cardIndex+1})`));

    // Memory Cost Stuff
    let memoryMod = target === 'player' ? dgmnData.cost : -1 * dgmnData.cost;
    this._memoryGauge.updateMemory(memoryMod);

    if(target === 'player'){
       this.server.sendMessage( {actnName:'play-digimon-to-battlefield',actnTarget:'opponent',actnCardNumber:cardNumber,actnCardIndex:cardIndex} );
       if(this.isTurnOver()){
         this.removeHandEvents();
         setTimeout(() => {this.actionQueue.push( {actnName:'update-phase',actnPhase:'end',actnPlayer:this.playerNumber} ); },2000);
       }
    }
  }

  evolveBreedingDigimonAction(target,cardNumber,evolvedFrom,cardIndex){

    console.log("EVOLVING A DGMN = ",evolvedFrom);

    this[target+'Hand'].cards.splice(cardIndex,1);
    this[target+'Hand'].elem.removeChild(this[target+'Hand'].elem.querySelector(`li:nth-of-type(${cardIndex+1})`));

    evolvedFrom.evolveDgmn(target, cardNumber);

    if(target === 'player'){
      this.server.sendMessage( {actnName: 'evolve-breeding-dgmn',actnTarget:'opponent',actnEvolvedFrom:evolvedFrom,actnCardNumber:cardNumber,actnCardIndex:cardIndex})
      if(this.isTurnOver()){
        this.removeHandEvents();
        setTimeout(() => {this.actionQueue.push( {actnName:'update-phase',actnPhase:'end',actnPlayer:this.playerNumber} ); },2000);
      }
    }
  }

  isTurnOver(){
    return this._memoryGauge.memory < 0
  }

  removeHandEvents(){
    let cardElems = document.getElementById('player-hand').querySelectorAll("li");
    for(let i = 0; i < cardElems.length; i++){
      cardElems[i].replaceWith(cardElems[i].cloneNode(true));
    }
  }

  removeAllFocuses(){

  }

  /**----------------------------------------------------------------------------------
   * ----------------------------------------------------------------------------------
   * ----------     RUN ACTION                 ----------------------------------------
   * ----------------------------------------------------------------------------------
   * Takes the action sent in by the player or server and runs the necessary commands
   * ----------------------------------------------------------------------------------
   * @param {Object}  action   Message object from Player or Server
   * --------------------------------------------------------------------------------*/
  runAction(action){
    let actnName = action.actnName;
    let actnTarget = action.actnTarget;

    if(action.actnMessage) logServer(action.actnMessage);

    switch (actnName){
      case 'notify': // Nothing more than sending a message to the Client, no inherit Action to take
        break;
      case 'set-player-number':
        this.playerNumber = action.actnValue;
        break;
      case 'players-ready':
        console.log("DISPLAY THE DECK SELECTOR"); // TODO - Actually prompt this, in the future...
        let deck = this.playerNumber === 1 ? starterDeckOne : starterDeckTwo; // For now, just send starter deck one or two
        this.actionQueue.push({
          actnName:'load-deck',
          actnPlayer: this.playerNumber,
          actnValue: deck,
          actnRunner: 'server'
        });
        this.actionQueue.push({
          actnName:'load-breeding-deck',
          actnPlayer: this.playerNumber,
          actnValue: deck,
          actnRunner: 'server'
        });
        this.actionQueue.push({
          actnName:'shuffle-decks',
          actnPlayer:this.playerNumber,
          actnRunner: 'server'
        })
        break;
      case 'shuffle-decks':
        // TODO - Show a cute deck animation
        logNote("DECKS SHUFFLED");

        // TODO - HAVE PLAYERS PLAYER RPS TO DETERMINE WHO'S UP FIRST (TIE TURNS INTO A COIN FLIP)
        // Until then...
        if(this.playerNumber === 1 ){
          let winner = 1;
          this.actionQueue.push({
            actnName: 'going-first',
            actnPlayer: winner,
            actnRunner: 'server'
          })
        }
        break;
      case 'update-phase':
        logNote(`Player ${action.actnPlayer} - ${action.actnValue} Phase`);
        this.currentPhase = action.actnValue;
        this.showPhase(action.actnValue,action.actnPlayer);
        break;
      case 'restore-security':
        for(let card of action.actnValue){
          if(action.actnPlayer === this.playerNumber){
            this.actionQueue.push({actnName:'restore',actnPlayer: this.playerNumber,actnRunner:'client',actnValue:card})
          } else{
            this.actionQueue.push({actnName:'restore',actnPlayer: getOpponentNumber(this.playerNumber),actnRunner:'client',actnValue:card})
          }
        }
        break;
      case 'draw-cards':
        for(let card of action.actnValue){
          if(action.actnPlayer === this.playerNumber){
            this.actionQueue.push({actnName:'draw',actnPlayer: this.playerNumber,actnRunner:'client',actnValue:card})
          } else{
            this.actionQueue.push({actnName:'draw',actnPlayer: getOpponentNumber(this.playerNumber),actnRunner:'client',actnValue:card})
          }
        }
        break;
      // case 'draw':
      //   console.log("DRAW");
      //   this.drawAction(actnTarget);
      //   break;
      // case 'restore':
      //   this.restoreAction(actnTarget);
      //   break;
      // case 'server-tap':
      //   this._server.sendMessage({actnName:'server-tap'});
      //   break;
      // case 'update-phase':
      //   this.updatePhaseAction(action.actnPhase,action.actnPlayer);
      //   break;
      // case 'hatch':
      //   this.hatchAction(action.actnTarget,action.actnDgmn);
      //   break;
      // case 'play-triage':
      //   this.playTriageAction(action.actnTarget,action.actnCardNumber,action.actnCardIndex);
      //   break;
      // case 'play-digimon-to-battlefield':
      //   this.playDigimonToBattlefieldAction(action.actnTarget,action.actnCardNumber,action.actnCardIndex);
      //   break;
      // case 'evolve-breeding-dgmn':
      //   this.evolveBreedingDigimonAction(action.actnTarget,action.actnCardNumber,action.actnEvolvedFrom,action.actnCardIndex);
      //   break;
      // case 'server-tap':
      //   this.server.sendMessage({actnName:'server-tap'});
      //   break;
      case 'reject-connection':
        serverLog("Connection Rejected => ",action.actnMessage);
        break;
      default:
        logWarning(`WARNING: Game Action not found => ${actnName}`);
        break;
    }
  }

  runClientAction(action){
    if(action.actnRunner === 'server'){
      this.server.sendMessage(this.actionQueue[0]);
    } else{
      switch(action.actnName){
        case 'restore':
          this.restoreAction(action.actnPlayer, action.actnValue);
          break;
        case 'draw':
          this.drawAction(action.actnPlayer, action.actnValue);
          break;
        default:
          logWarning('Action not found on Client...');
          break;
      }
    }
  }

  /**----------------------------------------------------------------------------------
   * ----------------------------------------------------------------------------------
   * ----------     WEBSOCKET EVENTS                -----------------------------------
   * ----------------------------------------------------------------------------------
   * --------------------------------------------------------------------------------*/

  onOpen(){
      logServer('WS - Open => ',this.server.username);
      this.server.sendMessage({
        actnName: 'join',
        actnUsername: this.server.username
      });
  }

  onMessage(message){
    let msg = JSON.parse(message.data);

    this.runAction(msg);
  }

  onClose(){
    logServer('WS - Closed => ',this.server.username);
    this.server.sendMessage({
      actnName: 'leave',
      actnUsername: this.server.username
    });
  }

  showPhase(phase, player){
    this.phaseMessage.innerHTML = `<p class='player-number'>Player ${player}</p><p class='phase-name'>${phase}</p>`
    this.phaseMessage.classList.add('show');
    setTimeout(() => {this.phaseMessage.classList.remove('show')},2500);
  }

  /**----------------------------------------------------------------------------------
   * ----------------------------------------------------------------------------------
   * ----------     EVENT LISTENERS                 -----------------------------------
   * ----------------------------------------------------------------------------------
   * --------------------------------------------------------------------------------*/

  setEventListeners(){
    this.playerBreeding.breedingDeckElem.addEventListener('click',(e)=>{
      this.playerBreeding.hatchTrigger(e,this.actionQueue,this.currentPhase === 'breeding',this.currentPlayer === this.playerNumber);
    });
  }

  attachHandEventListeners(){
    let cardElems = document.getElementById('player-hand').querySelectorAll("li");
    for(let i = 0; i < cardElems.length; i++){
      cardElems[i].addEventListener('click',(e) => {
        console.log("HAND CHECK = ",this.playerHand.cards);
        console.log("Index = ",i);
        this.playerHand.matchCardElem(e.currentTarget.dataset.cardId).playTrigger(e,this.actionQueue,this.currentPhase === 'main',this.currentPlayer === this.playerNumber,getIndex(e.currentTarget));
      });
    }
  }


  /**----------------------------------------------------------------------------------
   * ----------------------------------------------------------------------------------
   * ----------     GETTERS & SETTERS               -----------------------------------
   * ----------------------------------------------------------------------------------
   * --------------------------------------------------------------------------------*/

  get server(){ return this._server }

  get phaseMessage(){ return this._phaseMessage }

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
  get playerBreeding(){ return this._playerBreeding }
  get playerBattlefield(){ return this._playerBattleField }

  get opponentDeck(){ return this._opponentDeck }
  set opponentDeck(newDeck) { this._opponentDeck = newDeck }
  get opponentHand(){ return this._opponentHand }
  get opponentSecurity(){ return this._opponentSecurity }
  get opponentBreeding(){ return this._opponentBreeding }
  get opponentBattlefield(){ return this._opponentBattlefield }
}