import React, {useState} from 'react';

import './css/field.css';

const Trash = () => {

    const [trashCardCount, setTrashCardCount] = useState();

    return (
        <div className='trash-zone'>
            <button className='deck-click'><img src=''/></button>
        </div>
    )
}

export default Trash;