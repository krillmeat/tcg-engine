class Battlefield {
  constructor(elem){
    this._elem = elem;
    this._dgmnList = [];
  }

  addDgmn(dgmnId,cardNumber){
    let dgmnElem = document.createElement("div");
        dgmnElem.classList.add("dgmn");
        dgmnElem.dataset.dgmnId = dgmnId;
        dgmnElem.innerHTML = `<img src='https://rossdanielconover.com/`
  }

  doBattlefieldThing(message,aq){
    console.log("do battlefield thing ",message);
  }

  get elem(){ return this._elem }
  get dgmnList(){ return this._dgmnList }
  set dgmnList(newList){ this._dgmnList = newList }
}