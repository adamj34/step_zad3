import React, { useState }from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './SidebarRight'

const Search = () => {
  const [queryParam, setQueryParam] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    axios.get('https://localhost:8000/mainPage/searchPeople', {params: {queryParam: queryParam}})
    .then(res => {
      if (res.data.msg === 'Users found') {
        console.log(res.data.users)
        setSearchResults(res.data.users)
      }
    })
    .catch(err => console.log(err))
  }

  const handleChooseProfile = (userId) => {
    navigate(`/mainPage/profile/${userId}`)
  }

  return (
    <div className='search'>
      <form onSubmit={handleSearch}>
        <label>Search People:</label>
        <input
          type='text'
          onChange={e => setQueryParam(e.target.value)}></input>
		    <button type='submit'>Search</button>
      </form>
      {searchResults ? searchResults.map(user => 
        <div key={user._id} onClick={() => handleChooseProfile(user._id, user.username)} className='result'>
          <h5>{user.username}</h5>
          <img src={user.picture ? user.picture : '/images/default_profile_pic.png'} alt="profile pic" ></img> 
          <p>{`${user.name} ${user.last_name}`}</p>
        </div>
        ): null}
    </div>
  )
}

export default Search