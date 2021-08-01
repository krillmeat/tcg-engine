import {useState} from 'react';
import './App.css';
import Chat from './chat';
import LoginPrompt from './login/login-prompt';

const checkIfLoggedIn = loggedInStatus => {
  return loggedInStatus;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    checkIfLoggedIn(isLoggedIn) ? <Chat/> : <LoginPrompt />
  );
}

export default App;
