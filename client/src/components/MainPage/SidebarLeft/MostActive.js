import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MostActive = () => {
    const [mostActive, setMostActive] = useState([])

    useEffect(() => {
		axios.get('https://localhost:8000/mainPage/ranking/activity')
			.then(res => setMostActive(res.data.users))
			.catch(err => console.log(err))
    }, [])

  return (
    <div>
        {mostActive.map((user, inx) => (
			<p key={inx}>{`${inx+1}. ${user.username}: ${user.totalScore}`}</p>
		))}
    </div>
  )
}

export default MostActive