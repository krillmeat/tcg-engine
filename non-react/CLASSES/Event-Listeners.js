class EventListeners{
  cosntructor(){
    this.BOUND_PlayToFieldClickEvent;
    this.BOUND_HandCardClickEvent;
  }

  /**
   * 
   * @param {Node} elem 
   * @param {String} type 
   * @param {String} eventName 
   * @param {Object} params 
   */
  createEventListener(elem, type, eventName,callback){
    this['BOUND_'+eventName] = this.triggerCallback.bind(this,callback)
    elem.addEventListener(type,this['BOUND_'+eventName]);
  }

  removeEventListener(elem,type,eventName){
    elem.removeEventListener(type,this['BOUND_'+eventName]);
  }

  triggerCallback(callback,e){
    callback(e);
  }

}