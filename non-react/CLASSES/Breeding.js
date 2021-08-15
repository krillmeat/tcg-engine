class Breeding{
  constructor(elem){
    this._elem = elem;
    this._breedingDeck = [];
    this._currentBreeding = null;
    this._breedingDeckElem = this._elem.querySelector(".breeding-deck");
    this._breedingDgmnElem = this._elem.querySelector(".current-breeding");
  }

  buildDeck(decklist){
    let cardList = [];
    for(let card of decklist){
      cardList.push(new Card(card));
    }
    return cardList;
  }

  hatchTrigger(e, aQ, isBreedingPhase, isYourTurn){
    console.log("Breeding Phase ? ",isBreedingPhase);
    console.log("Your turn ? ",isYourTurn);
    if(isBreedingPhase && isYourTurn){
      if(!this.currentBreeding){
        aQ.push({actnName:'hatch',actnTarget:'player'});
      }
    }
  }

  get elem(){ return this._elem }

  get breedingDeck(){ return this._breedingDeck }
  set breedingDeck(newDeck){ this._breedingDeck = newDeck }
  get currentBreeding(){ return this._currentBreeding }
  set currentBreeding(newBreeding){ this._currentBreeding = newBreeding }

  get breedingDeckElem(){ return this._breedingDeckElem }
  get breedingDgmnElem(){ return this._breedingDgmnElem }
}