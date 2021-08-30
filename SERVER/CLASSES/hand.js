class Hand {
    constructor(){
        this._cards = [];
    }

    addCards(newCards){
        this.cards.push(...newCards);
    }

    removeCard(cardId){
      let cardIndex = this.findCardIndexById(cardId);
      this.cards.splice(cardIndex,1);
    }

    findCardById(cardId){
      let foundCard;
      for(let card of this.cards){
        if(card._cardId === cardId) foundCard = card;
      }

      return foundCard;
    }

    findCardIndexById(cardId){
      let cardIndex;
      for(let i = 0; i < this.cards.length; i++){
        if(this.cards[i]._cardId === cardId) cardIndex = i;
      }

      return cardIndex;
    }

    get cards(){ return this._cards }
    set cards(newCards){ this._cards = newCards }
}

module.exports = Hand;