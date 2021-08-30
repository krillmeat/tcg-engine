class Game {
  constructor(username, ws){
    
    // SERVER VARIABLES
    this._server = ws || new Server(username);                                      // Object - The WebSocket Server
    this.server.ws.onopen = () => { this.onOpen() };                                // Func   - What happens when the connection to the WS is started
    this.server.ws.onmessage = message => { this.onMessage(message) };              // Func   - What happens when the WS receives a message from the server
    this.server.ws.onclose = () => { this.onClose() };                              // Func   - What happens when the connection to the WS is closed

    this._allowAction = false;                                                      // Bool   - Whether or not actions from the player are currently allowed (might be removed)
    this._inPlayTriage = false;
    this._currentTriageId = undefined;
    this._playTriageCard = {};

    this._phaseMessage = document.querySelector(".phase-message");                  // HTML   - Message Element that pops up when the Phase changes

    this._memoryGauge = new MemoryGauge(getById('memory-gauge'));                   // Object - Memory Gauge

    this._currentPhase = 'none';                                                    // String - Denotes the current Phase of the Game/Turn
    this._currentPlayer = 0;                                                        // Number - Denotes which Player's Turn it currently is

    this._playerNumber = 0;                                                         // Number - Denotes the Player's Number (1 or 2)

    this._playerDeck;
    this._playerHand = new Hand(true,getById('player-hand'));                            // Object - Player's Hand
    this._playerSecurity = new Security(true,getById('player-security'));                // Object - Player's Security Stack
    this._playerBreeding = new Breeding(getById('player-breeding'));                // Object - Player's Breeding Area
    this._playerBattleField = new Battlefield(getById('player-battlefield'));       // Object - Player's Battlefield

    this._opponentDeck;
    this._opponentHand = new Hand(false,getById('opponent-hand'));                        // Object - Opponent's Hand
    this._opponentSecurity = new Security(false,getById('opponent-security'));            // Object - Opponent's Security Stack
    this._opponentBreeding = new Breeding(getById('opponent-breeding'));            // Object - Opponent's Breeding Area
    this._opponentBattlefield = new Battlefield(getById('opponent-battlefield'));   // Object - Opponent's Battlefield\


    this.playerHandElem = document.getElementById("player-hand");
    this.opponentHandElem = document.getElementById("opponent-hand");

    this.playerSecurityElem = document.getElementById("player-security");
    this.opponentSecurityElem = document.getElementById("opponent-security");

    this.eventListener = new EventListeners();
    this.messenger = new Messenger();
    this.clientRunner = new ClientRunner();


  /**----------------------------------------------------------------------------------
   * ----------     GAME TIMER                      -----------------------------------
   * --------------------------------------------------------------------------------*/

    this._actionQueue = [];

    this._gameTimerCounter = 0;
    this._gameTimer = setInterval(()=>{
      if(this.actionQueue.length > 0){
        let nextAction = this.actionQueue[0];
        if(nextAction.actnRunner === 'server'){
          this.server.sendMessage(nextAction);
        } else{
          this.runClientAction(nextAction);
        }
        this.actionQueue.splice(0,1);
      } else{
        this._gameTimerCounter++;
        if(this._gameTimerCounter %16 === 0) this.runAction({actnName:'server-tap'});
      }
    }, 250);
  }

  /**----------------------------------------------------------------------------------
   * ----------     ACTIONS                         -----------------------------------
   * --------------------------------------------------------------------------------*/

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


  cardTriage(cardId){

    this._currentTriageId = cardId;

    this.server.sendMessage({
      actnName: 'play-triage',
      actnPlayer: this.playerNumber,
      actnRunner: 'server',
      actnValue: cardId
    });
    
  }

  activatePlayDgmnToField(cardData){
    let playElem = document.getElementById('player-battlefield').querySelector(".play-to-field")
    playElem.classList.add("actionable");

    this.eventListener.createEventListener(playElem,"click","playToFieldClickEvent",this.playDgmnToFieldAction.bind(this));
    this.eventListener.createEventListener(playElem,"mouseover","memoryDeltaHoverEvent",this.showMemoryDelta.bind(this));
    this.eventListener.createEventListener(playElem,"mouseout","hideMemoryDeltaHoverEvent",this.hideMemoryDelta.bind(this));
  }

  deactivePlayDgmnToField(){
    let playElem = document.getElementById('player-battlefield').querySelector(".play-to-field");
    playElem.classList.remove("actionable");
    this.hideMemoryDelta();
    this.eventListener.removeEventListener(playElem,"click","playToFieldClickEvent");
    this.eventListener.removeEventListener(playElem,"mouseover","memoryDeltaHoverEvent");
    this.eventListener.removeEventListener(playElem,"mouseout","hideMemoryDeltaHoverEvent");
  }

  showMemoryDelta(){
    let cost = this._playTriageCard.cost;
    let memoryElem = document.getElementById("memory-gauge");
    let memoryNumbers = memoryElem.querySelectorAll("li");

    let currentIndex = 0;

    for(let i = 0; i < memoryNumbers.length; i++){
      if(memoryNumbers[i].classList.contains('current')){
        currentIndex = i;
      }
    }

    memoryElem.querySelectorAll("li")[ currentIndex + cost ].classList.add("delta");
  }

  hideMemoryDelta(){ document.getElementById("memory-gauge").querySelector(".delta").classList.remove("delta"); }

  playDgmnToFieldAction(e){
    
    this.server.sendMessage({
      actnName: 'play-dgmn-to-field',
      actnPlayer: this.playerNumber,
      actnRunner: 'server',
      actnValue: this._currentTriageId
    });

    this.deactivePlayDgmnToField();
    this._inPlayTriage = false;
    this._currentTriageId = undefined;
    this.playerHandElem.classList.remove("triage");
    this.playerHandElem.querySelector(".card.triage").classList.remove("triage");

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
      } else if(phase === 'main'){
        this.setupMainPhase(data);
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
   * SETUP MAIN PHASE
   * ----------------------------------------------------------------------------------
   * Get the Player ready for the Main Phase
   * Sets up Hand Events
   * --------------------------------------------------------------------------------*/
  setupMainPhase(hand){
    let obj = this;
    logNote("Hand Data = ",hand);
    let handCardElems = document.getElementById("player-hand").querySelectorAll("li"); // SWAP WITH CLASS-BASED LATER

    let _handler = (e,handCardData) => {
      if(!obj._inPlayTriage){
        obj._inPlayTriage = true;
        obj.playerHandElem.classList.add("triage");
        e.currentTarget.classList.add("triage");

        this.cardTriage(e.currentTarget.dataset.cardId);
      } else if(obj._inPlayTriage && obj._currentTriageId === e.currentTarget.dataset.cardId ){ 
        obj._inPlayTriage = false;
        obj.playerHandElem.classList.remove("triage");
        e.currentTarget.classList.remove("triage");
        this._currentTriageId = undefined;
        this._playTriageCard = {};
        this.deactivePlayDgmnToField();
       }
    }; let _binder = function(e){ _handler(e,obj._inPlayTriage);
      // handCardElem.removeEventListener("click",_binder,false) 
    }.bind(obj);

    for(let handCardElem of handCardElems){
      handCardElem.addEventListener("click", _binder, false);
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
        break;
      case 'draw-cards':
        break;
      case 'hatch-dgmn':
        if(action.actnPlayer === this.playerNumber){
          this.actionQueue.push({actnName:'hatch', actnPlayer: this.playerNumber, actnRunner: 'client', actnData: action.actnData})
        } else{
          this.actionQueue.push({actnName:'hatch', actnPlayer: getOpponentNumber(this.playerNumber), actnRunner: 'client', actnData: action.actnData})
        }
        break;
      case 'activate':
        if(action.actnValue === 'play-dgmn-to-field'){
          this.activatePlayDgmnToField(action.actnData);
        }
        break;
      case 'set-triage-card':
        this._playTriageCard = action.actnData;
        break;
      case 'update-memory':
        this._memoryGauge.elem.querySelector(".current").classList.remove("current");
        if(this.playerNumber === 1){
          this._memoryGauge.elem.querySelectorAll("li")[action.actnValue + 10].classList.add("current");
        } else{
          this._memoryGauge.elem.querySelectorAll("li")[( -1 * action.actnValue) + 10].classList.add("current");
        }
        break;
      case 'add-dgmn-to-battlefield':
        this.playerBattlefield.addDgmn(action.actnValue,action.actnData);
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

    let runner = this.clientRunner.run(action);

    if(runner.actor === 'game'){
      this[runner.job](action);
    } else if(runner.actor === 'messenger'){
      this.messenger[runner.job](action);
    } else{
      let target = action.actnPlayer === this.playerNumber ? 'player' : 'opponent';
      // Fetches the actor and the job, and sets the Player Number, Data, Action Queue callback, and Event Listener callback
      this[`_${target}${runner.actor}`][runner.job](action.actnData, action.actnPlayer, this._currentPhase, this.addToActionQueue.bind(this));
    }

    
      switch(action.actnName){
        case 'restore':
          break;
        case 'draw':
          break;
        case 'hatch':
          this.hatchAction(action.actnPlayer, action.actnData);
          break;
        default:
          logWarning('Action not found on Client...');
          break;
      }

  }

  /**----------------------------------------------------------------------------------
   * SET PLAYER NUMBER
   * ----------------------------------------------------------------------------------
   * Sets your Player Number to the correct value
   * ----------------------------------------------------------------------------------
   * @param {Object} data 
   * --------------------------------------------------------------------------------*/
  setPlayerNumber(data){
    this.playerNumber = data.actnValue;
    logDebug("Player Number set to ",data.actnValue);
  }

  /**----------------------------------------------------------------------------------
   * ADD TO ACTION QUEUE
   * ----------------------------------------------------------------------------------
   * Adds an Action Item to the Action Queue, to be run
   * ----------------------------------------------------------------------------------
   * @param {Object} action 
   * --------------------------------------------------------------------------------*/
  addToActionQueue(action){
    this._actionQueue.push(action);
  }

  // eventListenerActionHandler()

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

    let action = this.messenger.triage(msg);
    if(action.actor === 'game'){
      this[action.job](msg);
    } else if(action.actor === 'messenger'){
      this.messenger[action.job](msg);
    } else{
      let target = msg.actnPlayer === this.playerNumber ? 'player' : 'opponent';
      // Fetches the actor and the job, and sets the Player Number, Data, Action Queue callback, and Event Listener callback
      this[`_${target}${action.actor}`][action.job](msg.actnPlayer,msg.actnData,this.addToActionQueue.bind(this),this.eventListener);
    }
    
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