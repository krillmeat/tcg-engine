// import React,{useEffect, useState} from 'react';
// import ChatInput from './chat-input';
// import ChatMessage from './chat-message';

// const URL = 'wss://tcg-engine.herokuapp.com';
// // const URL = 'ws://localhost:5000';

// const Chat = () => {

//   let wsSetup = new WebSocket(URL);

//   const [ws, setWS] = useState(wsSetup);
//   const [username, setUsername] = useState('Ross');
//   const [messages, setMessages] = useState([]);

//   const [clients, setClients] = useState([]);

//   useEffect(() => {
//     console.log("WS",ws);
//     ws.onopen = () => {
//       console.log("WS - Open");
//       let id = Math.random();
//     }
//   }, [ws]);
  
//   ws.onmessage = e => {
//     const message = JSON.parse(e.data);
//     console.log("Message = ",message);
//     addMessage(message);
//   }

//   ws.onclose = () => {
//     console.log("WS Disconnected");
    // let wsReset = new WebSocket(URL);
//     setWS(wsReset);
//   }

//   const addMessage = messageString => {
//     setMessages(messages => [...messages, messageString]);
//   }

//   const usernameIntercept = e => {
//     setUsername(e.target.value);
//   }

//   const submitMessage =  messageString => {
//     const message = {
//       username: username,
//       message: messageString
//     };
//     ws.send(JSON.stringify(message));
//     addMessage(message);
//   }
//   return(
//     <>
//     <div>
//       <label htmlFor='username'>Name:&nbsp;</label>
//       <input
//         type='text'
//         id={'username'}
//         placeholder={'Enter your username...'}
//         value={username}
//         onChange={usernameIntercept} />
//     </div>
//     <ChatInput
//       ws = {ws}
//       onSubmitMessage={ submitMessage } />
//     {messages.map((message, index) =>
//       <ChatMessage
//         key={index}
//         message={message.message}
//         username={message.username}/>
//     )}
//     </>
//   )
// }

// export default Chat;