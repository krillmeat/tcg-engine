class MemoryGauge {
  constructor(elem){
    this._memory = 0;
    this._elem = elem;
  }

  get memory(){ return this._memory }
  set memory(newMemory){ this._memory = newMemory}
}