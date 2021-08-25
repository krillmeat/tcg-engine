const {generateId} = require('../utils.js')

class Dgmn{
  constructor(cardNumber){
    this._cardNumber = cardNumber;
    this._dgmnId = generateId();

  }

  get cardNumber(){ return this._cardNumber }
  set cardNumber(newNumber){ this._cardNumber = newNumber }

  get dgmnId(){ return this._dgmnId }
  set dgmnId(newId){ this._dgmnId = newId }
}

module.exports = Dgmn;