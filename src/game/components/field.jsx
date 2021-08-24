import React from 'react';
import Deck from './deck';
import Trash from './trash';
import MemoryTrack from './memory-track';
import Hand from './hand';
import Breeding from './breeding';
import Security from './security';

import './css/field.css';

const onDeckClick = () => {
  console.log("HHELLOO");
}

const Field = props => {
  const {readAction, gameState} = props;
  return (
    <div className='game-field'>
      <div className='top-player'>
        <div className='deck-trash-area'>
          <Deck clickDeck={()=> {console.log("WHAT")}}/>
          <Trash />
        </div>
        <Breeding />
        <Security />
        <Hand />
      </div>
      <div className='bottom-player'>
        <div className='deck-trash-area'>
          <Deck clickDeck={()=> {readAction({
            actionName: 'draw-card',
            actionParams: [],
            actionSender: 0
          })}}/>
          <Trash />
        </div>
        <Breeding />
        <Security />
        <Hand handCards={gameState.players[0].hand}/>
      </div>
      <MemoryTrack />
    </div>
  )
}

export default Field;