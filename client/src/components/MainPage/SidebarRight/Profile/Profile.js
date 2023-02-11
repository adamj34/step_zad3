import Cookies from 'js-cookie'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import LogOut from './LogOut'


const Profile = () => {
    const navigate = useNavigate()
    const userData = JSON.parse(localStorage.getItem('user'))

  return (
    <div className='profile'>
        <img src={userData.picture ? userData.picture : '/images/default_profile_pic.png'} 
        alt='user' />
        <p>{userData.username}</p>
        <button onClick={() => navigate('/mainPage/editProfile')}>Edit</button>
        <LogOut />
    </div>
  )
}

export default Profile