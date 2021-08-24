const { generateId } = require("../utils");

class Card{
  constructor(cardNumber){
    this._cardNumber = cardNumber;
    this._cardId = generateId();
  }

  get cardNumber(){ return this._cardNumber }
  set cardNumber(newNumber){ this._cardNumber = newNumber }
}

module.exports = Card;