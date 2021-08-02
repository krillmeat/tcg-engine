import React, {useState} from 'react';

import './css/field.css';

const Deck = () => {

    const [cardCount, setCardCount] = useState();
    return (
        <div className='deck-zone'>
            <button className='deck-click'><img src='/card-back.png'/></button>
        </div>
    )
}

export default Deck;