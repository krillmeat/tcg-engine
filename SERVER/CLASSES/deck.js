class Deck {
  constructor(){
    this._cards = [];
  }

  addCard(card){
    this.cards.push(card);
  }

  get cards(){ return this._cards }
  set cards(newCards){ this._cards = newCards }
}

module.exports = Deck;