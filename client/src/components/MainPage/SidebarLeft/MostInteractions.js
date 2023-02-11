import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MostInteractions = () => {
	const [interactionsStats, setInteractionsStats] = useState([])

    useEffect(() => {
		axios.get('https://localhost:8000/mainPage/ranking/interactions')
			.then(res => setInteractionsStats(res.data.users))
			.catch(err => console.log(err))
    }, [])

  return (
    <div>
        {interactionsStats.map((user, inx) => (
			<p key={inx}>{`${inx+1}. ${user.username}: ${user.totalScore}`}</p>
		))}
    </div>
  )
}

export default MostInteractions