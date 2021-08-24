class Hand {
  constructor(elem){
    this._cards = [];
    this._elem = elem;
  }

  drawCard(card){
    this.cards.push(card);
    this.elem.appendChild(card.elem);
  }

  matchCardElem(id){
    for(let card of this.cards){
      if(card.cardId === id) return card;
    }
  }

  get elem(){ return this._elem }

  get cards(){ return this._cards }
  set cards(newCards){ this._cards = newCards }
}