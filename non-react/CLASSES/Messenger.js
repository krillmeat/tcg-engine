class Messenger{
  constructor(){

  }

  triage(message){
    let action = {};

    switch(message.actnName){
      case 'set-player-number':
        action.actor = 'game';
        action.job = 'setPlayerNumber';
        break;
      case 'restore-security':
        action.actor = 'Security';
        action.job = 'restore';
        break;
      case 'draw-cards':
        action.actor = 'Hand';
        action.job = 'draw';
        break;
      case 'notify':
        action.actor = 'messenger';
        action.job = 'messengerLog';
        break;
      default:
        action.actor = 'messenger';
        action.job = 'messengerError';
        break;
    }

    return action;
  }

  messengerError(actionName){
    // console.log("Messenger Received unknown message: ",actionName);
  }

  messengerLog(actionName){
    // Nothing
  }
}