import React, {useState} from 'react';

import './css/field.css';

const Breeding = () => {

    const [breedingDeckCardCount, setBreedingDeckCardCount] = useState();
    return (
        <div className='breeding-zone'>
            <button className='deck-click'><img src='https://i.imgur.com/X1ASfWl.png'/></button>
            <div className='current-raising'><img src=''/></div>
        </div>
    )
}

export default Breeding;