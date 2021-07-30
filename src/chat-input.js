import React from 'react';
import PropTypes from 'prop-types';

const ChatInput = () => {

  const onSubmit = () => {
    e.preventDefault();
    this.props.onSubmitMessage(this.state.message);
    this.setState({message:''})
  }

  const messageOnChange = () => {
    this.setState({message: e.target.value});
  }

  return (
    <form
      action='.'
      onSubmit={onSubmit}>
        <input
          type='text'
          placeholder={'Enter Message'}
          value={this.state.message}
          onChange={messageOnChange}/>
          <input type='submit' value={'Send'} />
    </form>
  )
}

ChatInput.propTypes = {
  onSubmitMessage: PropTypes.func.isRequired,
  state = {
    message: ''
  }
}

export default ChatInput;