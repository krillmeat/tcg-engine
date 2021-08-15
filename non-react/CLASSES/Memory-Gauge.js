class MemoryGauge {
  constructor(elem){
    this._memory = 0;
    this._elem = elem;

    this.getMarker().classList.add("current");
  }

  updateMemory(cost){
    this.memory = this.memory - cost;
    this.clearMemoryMarker();
    this.getMarker().classList.add("current");
  }

  clearMemoryMarker(){
    let markers = this._elem.querySelectorAll("li");
    for(let marker of markers){
      marker.classList.remove("current");
    }
  }

  getMarker(){
    return this._elem.querySelector(`li:nth-of-type(${11 - this.memory})`);
  }

  get elem(){ return this._elem }

  get memory(){ return this._memory }
  set memory(newMemory){ this._memory = newMemory}
}