class Card {
  constructor(cardNumber,existingId){
    this._cardNumber = cardNumber;
    this._cardId = existingId || this.generateCardId();
    this._elem = this.renderCard();
  }

  renderCard(){
    let cardElem = document.createElement("li");
        cardElem.classList.add("card");
        cardElem.dataset.cardNumber = this.cardNumber;
        cardElem.dataset.cardId = this.cardId;
        cardElem.classList.add(this.cardNumber);
        cardElem.innerHTML = `<img src='https://rossdanielconover.com/DGMN_CARDS/CARDS/${this.getCardSet(this.cardNumber)}/${this.cardNumber}.png'/>`;
    
    return cardElem;
  }

  generateCardId(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**----------------------------------------------------------------------------------
   * GET CARD SET
   * ----------------------------------------------------------------------------------
   * Takes the Card Number and send back just the Card Set
   * ----------------------------------------------------------------------------------
   * @param {String} cardNumber Card's specific set number (ST1-01)
   * @return The Set the card belongs to
   * --------------------------------------------------------------------------------*/
  getCardSet(cardNumber){
    let setNumber;
        setNumber = cardNumber.indexOf('-') !== -1 ? cardNumber.split("-")[0] : 'XX1';
    return setNumber;
  }

  playTrigger(e,aq,isMainPhase,isYourTurn,index){
    if(isMainPhase && isYourTurn){
      e.target.classList.add('triage');
      aq.push({actnName:'play-triage',actnTarget:'player',actnCardNumber:this.cardNumber,actnCardIndex:index});
    }
  }


  get cardNumber(){ return this._cardNumber }
  set cardNumber(newNumber){ this._cardNumber = newNumber }

  get elem(){ return this._elem }

  get cardId(){ return this._cardId }
}