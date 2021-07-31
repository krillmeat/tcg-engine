import React, {useState} from 'react';
import PropTypes from 'prop-types';

const ChatInput = props => {

  const {onSubmitMessage} = props;
  const [message, setMessage] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    console.log(message);
    onSubmitMessage(message);
    setMessage(message);
  }

  const messageOnChange = e => {
    setMessage(e.target.value);
  }

  return (
    <form
      action='.'
      onSubmit={onSubmit}>
        <input
          type='text'
          placeholder={'Enter Message'}
          value={message}
          onChange={messageOnChange}/>
          <input type='submit' value={'Send'} />
    </form>
  )
}

ChatInput.propTypes = {
  onSubmitMessage: PropTypes.func.isRequired
}

export default ChatInput;