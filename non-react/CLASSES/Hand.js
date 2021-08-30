class Hand {
  constructor(isPlayers, elem){
    this._cards = [];
    this._isPlayers = isPlayers;
    this._elem = elem;
  }

  addCard(cardData,player,phase,aq){
    let newCardElem = document.createElement("li");
        newCardElem.classList.add("card");
        newCardElem.dataset.cardId = cardData._cardId;
        newCardElem.innerHTML = `<img src='https://rossdanielconover.com/DGMN_CARDS/CARDS/${getCardSet(cardData._cardNumber)}/${cardData._cardNumber}.png'/>`;

    this.elem.appendChild(newCardElem);

    if(this.doesDrawEndPhase(phase) && this._isPlayers){
      setTimeout(() => {
        aq({
          actnName: 'phase-complete',
          actnPlayer: player,
          actnValue: phase,
          actnRunner: 'server'
        })
      },1000);
    }
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

  draw(player,cardList,aq){
    for(let card of cardList){
      aq({
        actnName: 'draw',
        actnPlayer: player,
        actnRunner: 'client',
        actnData: card });
    }
  }

  doesDrawEndPhase(phase){
    if(phase === 'setup'){
      if(this.elem.querySelectorAll("li").length === 5){
        return true;
      }
    } else if(phase === 'draw'){
      return true;
    }
    return false;
  }

  get elem(){ return this._elem }

  get cards(){ return this._cards }
  set cards(newCards){ this._cards = newCards }
}