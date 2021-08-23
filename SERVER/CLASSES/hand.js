class Hand {
    constructor(){
        this._cards = [];
    }

    addCards(newCards){
        this.cards.push(...newCards);
    }

    get cards(){ return this._cards }
    set cards(newCards){ this._cards = newCards }
}

module.exports = Hand;