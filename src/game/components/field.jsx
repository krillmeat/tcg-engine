import React from 'react';
import Deck from './deck';

import './css/field.css';

const Field = props => {
  return (
    <div className='game-field'>
      <div className='top-player'>
        <Deck />
      </div>
      <div className='bottom-player'>
        <Deck />
      </div>
    </div>
  )
}

export default Field;