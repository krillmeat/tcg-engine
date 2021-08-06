class Deck {
  constructor(elem,player,decklist){
    this._elem = elem;
    this._player = player;
    this._decklist = decklist;
    this._cards = this.createDeck(this.decklist);

    this.updateDeckCount(this.cards.length);
  }

  createDeck(decklist){
    let cardList = [];
    for(let card of decklist){
      cardList.push(new Card(card));
    }
    return cardList;
  }

  updateDeckCount(){
    let newCount = this.cards.length;
    let deckCountElem = this.elem.querySelector(".deck-count");
        deckCountElem.innerHTML = newCount;
        this.elem.querySelector('img').style.setProperty('box-shadow',`0 ${newCount/2}px 0 0 #07054F`);
        this.elem.querySelector('img').style.setProperty('transform',`translateY(${-newCount/2.5}px)`)
  }

  shuffle(){
    let shuffledCards = this.cards;
    for(var i = shuffledCards.length -1; i > 0; i--){
      var j = Math.floor(Math.random()* (i+1));
      var temp = shuffledCards[i];
      shuffledCards[i] = shuffledCards[j];
      shuffledCards[j] = temp;
    }
    this.cards = shuffledCards;
  }

  drawCard(){
    this.cards.splice(0,1);
    this.updateDeckCount()
  }

  get elem(){ return this._elem }
  set elem(newElem){ this._elem = newElem }

  get decklist(){ return this._decklist }
  set decklist(newDecklist){ this._decklist = newDecklist }

  get cards(){ return this._cards }
  set cards(newCards){ this._cards = newCards }
}