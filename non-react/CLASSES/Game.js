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

    this._gameTimerCounter = 0;
    this._gameTimer = setInterval(()=>{
      if(this.actionQueue.length > 0){
        // this.runAction(this.actionQueue[0]);
        this.runClientAction(this.actionQueue[0]);
        this.actionQueue.splice(0,1);
      } else{
        this._gameTimerCounter++;
        if(this._gameTimerCounter %16 === 0) this.runAction({actnName:'server-tap'});
        // if(this._gameTimerCounter %32 === 0) this.runAction({actnName:'state-update'});
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

  hatchAction(player, dgmn){
    let newDgmnElem = document.createElement("div");
        newDgmnElem.classList.add("dgmn");
        newDgmnElem.dataset.dgmnId = dgmn._dgmnId;
        newDgmnElem.innerHTML = `<img src='https://rossdanielconover.com/DGMN_CARDS/DGMN/${getCardSet(dgmn._cardNumber)}/${dgmn._cardNumber}.png'/>`;

    if(player === this.playerNumber) { 
      document.getElementById('player-breeding').querySelector(".current-breeding").appendChild(newDgmnElem); 
      setTimeout(() => {
        this.server.sendMessage({actnName: 'phase-complete', actnPlayer: this.playerNumber, actnValue: 'breeding'})
      },1000);
    } else{
      document.getElementById('opponent-breeding').querySelector(".current-breeding").appendChild(newDgmnElem);
    }
  }

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

  /**----------------------------------------------------------------------------------
   * HANDLE PHASE
   * ----------------------------------------------------------------------------------
   * When a Phase Begins, should properly get the Client set up
   * ----------------------------------------------------------------------------------
   * @param {String} phase  The current Phase to set up
   * @param {Number} player The player whose Phase it is
   * --------------------------------------------------------------------------------*/
  handlePhase(phase,player,data){
    if(player === this.playerNumber){
      if(phase === 'breeding'){
        this.setupBreedingPhase(data);
      }
    }
  }

  /**----------------------------------------------------------------------------------
   * SETUP BREEDING PHASE
   * ----------------------------------------------------------------------------------
   * Get the Player ready for the Breeding Phase
   * --------------------------------------------------------------------------------*/
  setupBreedingPhase(breedingData){
    let breedingDeck = breedingData.deck;
    let breedingDgmn = breedingData.breedingDgmn;

    // Show a skip button

    if(!breedingDgmn){
      logNote("No current DGMN in the Breeding Zone, only option is hatch...");
      let breedingDeckElem = document.getElementById("player-breeding");
          breedingDeckElem.classList.add("actionable");
     
      // Event Handler
      let _handler = (hatchCard) => {

        this.server.sendMessage({
          actnName: 'breeding-phase',
          actnPlayer: this.playerNumber,
          actnRunner: 'server',
          actnValue: 'hatch'
        });
        
      }; let _binder = function(){ _handler(breedingDeck._cards[0]);
        breedingDeckElem.classList.remove("actionable");
        breedingDeckElem.removeEventListener("click",_binder,false); }.bind(this);

      breedingDeckElem.addEventListener("click", _binder, false);
    } else{
      logNote("DGMN currently in Breeding Zone, only option is promote...");

      // Promote Event
    }
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

        // TODO - HAVE PLAYERS PLAY RPS TO DETERMINE WHO'S UP FIRST (TIE TURNS INTO A COIN FLIP)
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
        action.actnData ? this.handlePhase(action.actnValue,action.actnPlayer,action.actnData) : this.handlePhase(action.actnValue,action.actnPlayer);
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
      case 'hatch-dgmn':
        if(action.actnPlayer === this.playerNumber){
          this.actionQueue.push({actnName:'hatch', actnPlayer: this.playerNumber, actnRunner: 'client', actnData: action.actnData})
        } else{
          this.actionQueue.push({actnName:'hatch', actnPlayer: getOpponentNumber(this.playerNumber), actnRunner: 'client', actnData: action.actnData})
        }
        break;
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
        case 'hatch':
          this.hatchAction(action.actnPlayer, action.actnData);
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