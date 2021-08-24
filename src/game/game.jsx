import React,{useEffect, useState, useRef} from 'react';
// import Card from './components/card';
import Deck from './components/deck';
import Trash from './components/trash';
import MemoryTrack from './components/memory-track';
import Hand from './components/hand';
import Breeding from './components/breeding';
import Security from './components/security';

import {buildInitialGameState} from './utils/game-state';
import {shuffleCards, gameLog} from './utils/game-utils';

// TEMP IMPORTS
import {starterDeckOne} from '../cards/deck.db';

// const URL = 'wss://tcg-engine.herokuapp.com';
const URL = 'ws://localhost:5000';

const Game = props => {

  const {username} = props;
  let wsSetup = new WebSocket(URL);
  const [ws, setWS] = useState(wsSetup);

  const gameState = useRef(buildInitialGameState(starterDeckOne,starterDeckOne));
  const playerDeck = useRef(starterDeckOne[1]);
  const opponentDeck = useRef(starterDeckOne[1]);

  const [playerHand, setPlayerHand] = useState([]);
  const [playerSecurity, setPlayerSecurity] = useState([]);

  const [playerDeckTrigger, setPlayerDeckTrigger] = useState([]);
  const [playerHandTrigger, setPlayerHandTrigger] = useState([]);
  const [opponentDeckTrigger, setOpponentDeckTrigger] = useState([]);
  const [opponentHandTrigger, setOpponentHandTrigger] = useState([]);

  useEffect(() => {
    console.log("WS",ws);
    ws.onopen = () => {
      let id = username; // Todo - Make this attach to username from login
      console.log("WS - Open = "+username);
    }
  }, [ws]);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    gameLog("START!");
    
    
    setPlayerDeckTrigger({actionName:"load-deck",actionParams:[starterDeckOne[1]]})
    setOpponentDeckTrigger({actionName:"load-deck",actionParams:[starterDeckOne[1]]})

    setTimeout(() => {
      // shuffleDeck(0);
      // shuffleDeck(1);
      // setPlayerDeckTrigger({actionName:"shuffle"});
      // setOpponentDeckTrigger({actionName:"shuffle"});
      playerDeck.current = shuffleCards(playerDeck.current);
      opponentDeck.current = shuffleCards(opponentDeck.current);
    }, 1000);

    // setTimeout(() => {
    //   // drawCard(0,5);
    //   // drawCard(1,5);
    // }, 2000);
  }

  const shuffleDeck = player => {
    gameLog("Player "+(player+1)+" shuffling deck...");
    player === 0 ? setPlayerDeckTrigger({actionName:"shuffle"})
                 : setOpponentDeckTrigger({actionName:"shuffle"});
  }

  const drawCard = (player, number) => {
    gameLog("Player "+(player+1)+" drawing cards...");
    console.log(gameState.current.players[player].deck);
    let drawnCards = gameState.current.players[player].deck.slice(0,number);
    console.log("DRAWN CARDS = ",drawnCards);
    player === 0 ? setPlayerDeckTrigger({actionName:"draw-card",actionParams:[drawnCards]}) : setOpponentDeckTrigger({actionName:"draw-card",actionParams:[drawnCards]});
    player === 0 ? setPlayerHandTrigger({actionName:"draw-card",actionParams:[drawnCards]}) : setOpponentHandTrigger({actionName:"draw-card",actionParams:[drawnCards]});
    gameState.current.players[player].deck = gameState.current.players[player].deck.slice(number);
    gameState.current.players[player].hand = oldHand => [drawnCards, ...oldHand];
  }

  // const actionManager = action => {
  //   switch(action.actionName){
  //     case 'draw-card':
  //       setPlayerHand(playerHand => [...playerHand, playerDeck[0]]);
  //       setPlayerDeck(playerDeck.slice(1));
  //       break;
  //     case 'load-deck':
  //       let deckList = action.actionParams[0];
  //       setPlayerDeck(deckList);
  //       break;
  //     case 'shuffle-deck':
  //       // setPlayerDeck(shuffleCards(shuffleCards(playerDeck)));
        
  //       break;
  //     case 'restore-one':
  //       setPlayerSecurity(playerSecurity => [...playerSecurity, playerDeck[0]]);
  //       setPlayerDeck(playerDeck.slice(1));
  //       break;
  //     default:
  //       return '';
  //   }
  // }

  // const actionRunner = actionList => {
  //   let intervalCount = 0;
  //   let actionTimer = setInterval(() => {
  //     console.log("ACTION = ",actionList[intervalCount]);
  //     actionManager(actionList[intervalCount]);
  //     intervalCount++;
  //     if(intervalCount >= actionList.length) clearInterval(actionTimer);
  //   },2000);
  // }

  // const readAction = action => {
  //   console.log("READING ACTION =",action);
  //   actionRunner([action]);
  // }

  const buttonLog = () => {
    // console.log("GAME STATE = ",gameState.current);
    console.log("PLAYER DECK = ",playerDeck);
    console.log("OPPONENT DECK = ",opponentDeck);
  }

  return (
    <div>
      <h1>Game time for {username}</h1>
      <div className='game-field'>
        <button onClick={buttonLog}>Click Me</button>
        <div className='top-player'>
          <div className='deck-trash-area'>
            {/* <Deck 
              key={1}
              deckList={gameState.current.players[1].deck}
              deckAction={opponentDeckTrigger} /> */}
            {/* <Trash /> */}
          </div>
          {/* <Breeding /> */}
          {/* <Security /> */}
          <Hand handAction={opponentHandTrigger}/>
        </div>
        <div className='bottom-player'>
          <div className='deck-trash-area'>
            {/* <Deck 
              key={0}
              deckList={gameState.current.players[0].deck}
              deckAction={playerDeckTrigger} /> */}
            {/*clickDeck={()=> {readAction({
              actionName: 'draw-card',
              actionParams: [],
              actionSender: 0
            })} sendAction()}*/}
            {/* <Trash /> */}
          </div>
          {/* <Breeding /> */}
          {/* <Security securityCards={playerSecurity} /> */}
          <Hand handAction={playerHandTrigger}/>
        </div>
        <MemoryTrack />
      </div>
            {/* {fakeCardList.map((setNumber, index) =>
      <Card
        key={index}
        setNumber={setNumber}/>
      )} */}
      {/* <button onClick={() => {
        setFakeCardList(['ST1-01',...fakeCardList]);
        ws.send(JSON.stringify({
          actionName: 'fake-add-card',
          actionParams: [
            'ST1-01'
          ],
          actionSender: username
        }));
      }}>Add Card</button> */}
    </div>
  )
};

export default Game;