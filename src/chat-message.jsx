import React from 'react';

const ChatMessage = (props) => {
  const {username, message} = props;
  return (
    <p>
      <strong>{username}</strong>:&nbsp;<em>{message}</em>
    </p>
  )
}

export default ChatMessage;