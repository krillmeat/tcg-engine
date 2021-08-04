import React, {useState} from 'react';

import './css/field.css';

const MemoryTrack = () => {

    const [currentMemory, setCurrentMemory] = useState();

    return (
        <div className='memory-track'>
            <ul>
              <li>10</li>
              <li>9</li>
              <li>8</li>
              <li>7</li>
              <li>6</li>
              <li>5</li>
              <li>4</li>
              <li>3</li>
              <li>2</li>
              <li>1</li>
              <li>0</li>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
              <li>5</li>
              <li>6</li>
              <li>7</li>
              <li>8</li>
              <li>9</li>
              <li>10</li>
            </ul>
        </div>
    )
}

export default MemoryTrack;