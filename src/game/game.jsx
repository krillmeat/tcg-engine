import React,{useEffect, useState} from 'react';
// import Card from './components/card';
import Field from './components/field';

import {buildInitialGameState} from './utils/game-state';

const URL = 'wss://tcg-engine.herokuapp.com';
// const URL = 'ws://localhost:5000';

const Game = props => {

  const {username} = props;
  let wsSetup = new WebSocket(URL);
  const [ws, setWS] = useState(wsSetup);

  const [gameState, setGameState] = useState(buildInitialGameState());

  useEffect(() => {
    console.log("WS",ws);
    ws.onopen = () => {
      let id = username; // Todo - Make this attach to username from login
      console.log("WS - Open = "+username);
    }
  }, [ws]);

  ws.onmessage = e => {
    const action = JSON.parse(e.data);
    console.log("RECEIVE STATE UPDATE: ",action);
    if(action.actionName==='fake-add-card'){
      setFakeCardList([action.actionParams[0],...fakeCardList]);
    }
  }

  const [fakeCardList, setFakeCardList] = useState(["ST1-01"]);

  return (
    <div>
      <h1>Game time for {username}</h1>
      <Field/>
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