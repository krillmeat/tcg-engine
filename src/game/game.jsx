import React,{useEffect, useState} from 'react';
import Card from './components/card';

const URL = 'wss://tcg-engine.herokuapp.com';
// const URL = 'ws://localhost:5000';

const Game = props => {

  const {username} = props;
  let wsSetup = new WebSocket(URL);
  const [ws, setWS] = useState(wsSetup);

  useEffect(() => {
    console.log("WS",ws);
    ws.onopen = () => {
      let id = username; // Todo - Make this attach to username from login
      console.log("WS - Open = "+username);
    }
  }, [ws]);

  ws.onmessage = e => {
    console.log("RECEIVE STATE UPDATE: ");
  }

  const [fakeCardList, setFakeCardList] = useState(["ST1-01"]);

  return (
    <div>
      <h1>Game time for {username}</h1>
      {fakeCardList.map((setNumber, index) =>
      <Card
        key={index}
        setNumber={setNumber}/>
      )}
      <button onClick={() => {
        setFakeCardList(['ST1-01',...fakeCardList]);
        ws.send(JSON.stringify({
          actionName: 'fake-add-card',
          actionSender: username
        }));
      }}>Add Card</button>
    </div>
  )
};

export default Game;