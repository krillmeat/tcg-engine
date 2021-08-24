class Deck {
  constructor(){
    this._cards = [];
  }

  addCard(card){
    this.cards.push(card);
  }

  shuffle(shuffleTimes){
    let shuffledCards = this.cards;
    for(var r = 0; r < shuffleTimes; r++){
      for(var i = shuffledCards.length -1; i > 0; i--){
        var j = Math.floor(Math.random()* (i+1));
        var temp = shuffledCards[i];
        shuffledCards[i] = shuffledCards[j];
        shuffledCards[j] = temp;
      }
    }
    this.cards = shuffledCards;
  }

  drawCards(amount){
    let drawnCards = this.cards.splice(0,amount);

    return drawnCards;
  }

  get cards(){ return this._cards }
  set cards(newCards){ this._cards = newCards }
}

module.exports = Deck;