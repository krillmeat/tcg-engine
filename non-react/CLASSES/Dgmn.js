class Dgmn{
  constructor(cardNumber,existingId){
    console.log("EXISTING ID ? ",existingId);
    this._cardNumber = cardNumber;
    this._dgmnId = existingId || this.generateDgmnId();
    this._elem = this.renderDgmn();
    this._DB = cardsDB[getCardSet(cardNumber)][getCardNumber(cardNumber)];
    this._dgmnName = this._DB.cardName;
    this._level = this._DB.level;
    this._DP = this._DB.dp;
    this._inheritedEffects = [];
    this._evoLine = [];
    this._securityChecks = 1;
    this._commonChecks = {
      blocker: false,
      reboot: false
    }
  }

  generateDgmnId(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  renderDgmn(){
    let dgmnElem = document.createElement("div");
        dgmnElem.classList.add("dgmn");
        dgmnElem.dataset.cardNumber = this.cardNumber;
        dgmnElem.classList.add(this.cardNumber);
        dgmnElem.dataset.dgmnId = this.dgmnId;
        dgmnElem.innerHTML = `<img src='https://rossdanielconover.com/DGMN_CARDS/DGMN/${getCardSet(this.cardNumber)}/${this.cardNumber}.png'/>`;
    
    return dgmnElem;
  }

  evolveDgmn(target,cardNumber){
    this.elem.querySelector("img").setAttribute('src',`https://rossdanielconover.com/DGMN_CARDS/DGMN/${getCardSet(cardNumber)}/${cardNumber}.png`);
  }

  get cardNumber(){ return this._cardNumber }
  get elem(){ return this._elem }
  set elem(newElem){ this._elem = newElem }
  get dgmnId(){ return this._dgmnId }
}