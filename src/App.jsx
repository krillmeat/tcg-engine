import {useEffect, useState} from 'react';
import './App.css';
import Chat from './chat';
import LoginPrompt from './login/login-prompt';
import Game from './game/game';

const checkIfLoggedIn = loggedInStatus => {
  return loggedInStatus;
}



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const loginCallback = username => {
    setUsername(username);
    setIsLoggedIn(true);
  }

  useEffect(() => {
    const url = window.location.href;
    const queryParam = url.substring(url.indexOf("?"));
  
    if(queryParam.indexOf("login=krillmeat") !== -1) {setIsLoggedIn(true);setUsername('krillmeat')}
  }, []);

  return (
    checkIfLoggedIn(isLoggedIn) 
      ? <Game
          username = {username}/> 
      : <LoginPrompt 
          loginCallback={loginCallback}/>
  );
}

export default App;
