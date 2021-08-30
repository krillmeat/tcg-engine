class Security{
  constructor(isPlayers, elem){
    this._isPlayers = isPlayers;
    this._elem = elem;
  }

  addSecurity(card){
    let newCardElem = document.createElement("li");
        newCardElem.classList.add("card");
        newCardElem.dataset.cardId = card._cardId;
        newCardElem.innerHTML = `<img src='https://rossdanielconover.com/DGMN_CARDS/card-back.png'/>`;

    this.elem.appendChild(newCardElem);
  }

  restore(player,cardList,aq){
    for(let card of cardList){
      aq({
        actnName: 'restore',
        actnPlayer: player,
        actnRunner: 'client',
        actnData: card });
    }
  }

  get elem(){ return this._elem }
}