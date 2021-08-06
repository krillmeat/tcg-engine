class Card {
  constructor(cardNumber){
    this._cardNumber = cardNumber;
    this._elem = this.renderCard();
  }

  renderCard(){
    let cardElem = document.createElement("li");
        cardElem.classList.add("card");
        cardElem.dataset.cardNumber = this.cardNumber;
        cardElem.classList.add(this.cardNumber);
    
    return cardElem;
  }

  getCardSet(cardNumber){
    return cardNumber.split("-")[0];
  }

  get cardNumber(){ return this._cardNumber }
  set cardNumber(newNumber){ this._cardNumber = newNumber }

  get elem(){ return this._elem }
}