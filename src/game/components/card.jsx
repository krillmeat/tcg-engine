import React from 'react';

const getSet = setData => {
  return setData.split("-")[0];
}

const Card = props => {
  const {
    setNumber,
    cardType,
    rarity,
    color  
  } = props;

  const imgSrc = `/cards/${getSet(setNumber)}/${setNumber}.png`;

  return (
    <>
      <img src={imgSrc}/>
    </>
  )
}

export default Card;