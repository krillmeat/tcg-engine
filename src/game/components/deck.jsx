import React, {useEffect, useState} from 'react';
import { shuffleCards } from '../utils/game-utils';
import './css/deck.css';

const Deck = props => {
  const {deckAction, clickDeck} = props;
  const [deckCards, setDeckCards] = useState([]);

  useEffect(() => {
    let actionName = deckAction.actionName;
    switch(actionName){
      case 'load-deck':
        setDeckCards(deckAction.actionParams[0]);
        break;
      case 'draw-card':
        let drawnCards = deckAction.actionParams[0];
        setDeckCards(deckCards.slice(deckAction.actionParams[0].length));
        break;
      case 'shuffle':
        console.log("DO THE SHUFFLE");
        let preShuffle = deckCards;
        let shuffled = shuffleCards(preShuffle);
        setDeckCards(shuffled);
        break;
      default: break;
    }
  }, [deckAction]);

    return (
      <div className='deck-zone'>
        <button className='deck-click' onClick={clickDeck}><img src='/card-back.png'/></button>
        <p className='deck-card-count'>{deckCards.length}</p>
      </div>
    )
}

export default Deck;