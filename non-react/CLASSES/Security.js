class Security{
  constructor(elem){
    this._cards = [];
    this._elem = elem;
  }

  restore(card){
    this.cards.push(card);
    this.elem.appendChild(card.elem);
  }

  get cards(){ return this._cards }
  set cards(newCards){ this._cards = newCards }

  get elem(){ return this._elem }
}