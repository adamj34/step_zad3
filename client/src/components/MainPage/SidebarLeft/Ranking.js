import React from 'react'
import MostInteractions from './MostInteractions'
import MostActive from './MostActive'

const Ranking = () => {
  return (
    <div className='Ranking'>
		  <h2>Ranking</h2>
      <h3>Most number of interactions:</h3>
      <MostInteractions />
      <h3>Most active users:</h3>
      <MostActive />
    </div>
  )
}

export default Ranking