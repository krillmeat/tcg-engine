import React from 'react';
import {getSet} from '../utils/game-utils';

const Card = props => {
  const {
    cardName,
    setNumber,
    cardType,
    rarity,
    color  
  } = props;

  const imgSrc = `/cards/${getSet(setNumber)}/${setNumber}.png`;

  return (
    <div className='card'>
      <img src={imgSrc}/>
    </div>
  )
}

export default Card;