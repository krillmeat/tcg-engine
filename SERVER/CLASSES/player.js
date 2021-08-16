class Player {
  constructor(username){
    this._username = username;
    this._deck = [];
    this._breedingDeck = [];
    this._breedingDgmn = undefined;
    this._hand = [];
    this._security = [];
    this._battlefieldDgmn = [];
    this._tamers = [];
  }

  get username(){ return this._username }
  set username(newUsername){ this._username = newUsername }

  get deck(){ return this._deck }
  set deck(newDeck){ this._deck = newDeck }

  get breedingDeck(){ return this._breedingDeck }
  set breedingDeck(newBreedingDeck){ this._breedingDeck = newBreedingDeck }

  get breedingDgmn(){ return this._breedingDgmn }
  set breedingDgmn(newDgmn){ this._breedingDgmn = newDgmn}

  get hand(){ return this._hand }
  set hand(newHand){ this._hand = newHand }

  get security(){ return this._security }
  set security(newSecurity){ this._security = newSecurity }

  get battlefieldDgmn(){ return this._battlefieldDgmn }
  set battlefieldDgmn(newBattlefieldDgmn){ this._battlefieldDgmn = newBattlefieldDgmn }

  get tamers(){ return this._tamers }
  set tamers(newTamers){ this._tamers = newTamers }
}

module.exports = Player;