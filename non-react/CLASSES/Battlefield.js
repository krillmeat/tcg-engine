class Battlefield {
  constructor(elem){
    this._elem = elem;
    this._dgmnList = [];
  }

  get elem(){ return this._elem }
  get dgmnList(){ return this._dgmnList }
  set dgmnList(newList){ this._dgmnList = newList }
}