import React from 'react';
import './login-prompt.css';

const onSubmit = e => {
  e.preventDefault();
  console.log("SUBMITTING LOGIN...");
}

const LoginPrompt = () => {
  return (
    <div className='login-prompt'>
      <h2>Log in, please...</h2>
      <form className='login-form' onSubmit={onSubmit}>
        <input type='text' placeholder='username'/>
        <input type='text' placeholder='password'/>
        <input type='submit' value={'Log In'} />
      </form>
    </div>
  )
};

export default LoginPrompt;