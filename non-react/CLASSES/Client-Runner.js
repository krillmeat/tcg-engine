class ClientRunner{
  constructor(){

  }

  run(message){
    let action = {};
    switch(message.actnName){
      case 'restore':
        action.actor = 'Security';
        action.job = 'addSecurity';
        break;
      case 'draw':
        action.actor = 'Hand';
        action.job = 'addCard';
        break;
      default:
        action.actor = 'messenger';
        action.job = 'messengerError';
      break;
    }

    return action;
  }

}