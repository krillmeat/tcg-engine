import React, {useState} from 'react';
import './login-prompt.css';

const validate = (username, password) => {
  // switch case for my boys
  switch(username){
    case 'krillmeat':
      if(password == 'haldo')
        return true;
    case 'tester':
      if(password == 'a')
        return true;
    default:
        return false;
  }
}

const LoginPrompt = props => {
  const {loginCallback} = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    console.log("SUBMITTING LOGIN...");
    if(validate(username,password)){ 
      loginCallback(username);
    } else{ console.log("WRONG USERNAME/PASSWORD"); }
  }

  const handleUsername = e => {
    setUsername(e.target.value);
  }

  const handlePassword = e => {
    setPassword(e.target.value);
  }

  return (
    <div className='login-prompt'>
      <h2>Log in, please...</h2>
      <form className='login-form' onSubmit={onSubmit}>
        <input type='text' placeholder='username' onChange={handleUsername}/>
        <input type='text' placeholder='password' onChange={handlePassword}/>
        <input type='submit' value={'Log In'} />
      </form>
    </div>
  )
};

export default LoginPrompt;