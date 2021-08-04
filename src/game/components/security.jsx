import React, {useState} from 'react';

const Security = props => {
  const {securityActions} = props;

  const [securityCards,setSecurityCards] = useState([]);
  return(
    <div className='security-zone'>
      <ul>
        {securityCards.map((card,index) => 
          <li key={index}><img src='/card-back.png'/></li>
        )}
      </ul>
    </div>
  )
}

export default Security;