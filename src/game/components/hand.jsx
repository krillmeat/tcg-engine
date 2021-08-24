import React, { useEffect, useState } from 'react';
import Card from './card';

import { getSet, getSetNumber } from '../utils/game-utils';

import {cardsDB} from '../../cards/card.db';

const Hand = props => {
  const {handAction} = props;
  const [handCards, setHandCards] = useState([]);

  // TEMP
  useEffect(() => {
    console.log("HAND CARDS = "+handCards);
  }, [handCards])

  useEffect(() => {
    let actionName = handAction.actionName;
    switch (actionName){
      case 'draw-card':
        let drawnCards = handAction.actionParams[0];
        console.log("DRAWN CARDS = "+drawnCards);
        setHandCards(prevHand => [drawnCards,...prevHand]);
        setHandCards(drawnCards);
        break;
      default: break;
    }
  },[handAction]);
  return (
    <>
      
      <div className='hand-zone'>
        {handCards?.length !== 0 ? handCards?.map((card,index) =>
          <Card 
            key={index} 
            cardName={cardsDB[getSet(card).cardName]} 
            setNumber={card}
          />
        ) : null}
      </div>
    </>
  )
}

export default Hand;