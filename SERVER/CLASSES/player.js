class Player {
  constructor(username){
    this._username = username;
    this._deck = [];
    this._breedingDeck = [];
    this._hand = [];
  }

  get username(){ return this._username }
  set username(newUsername){ this._username = newUsername }

  get deck(){ return this._deck }
  set deck(newDeck){ this._deck = newDeck }

  get breedingDeck(){ return this._breedingDeck }
  set breedingDeck(newBreedingDeck){ this._breedingDeck = newBreedingDeck }

  get hand(){ return this._hand }
  set hand(newHand){ this._hand = newHand }
}

module.exports = Player;