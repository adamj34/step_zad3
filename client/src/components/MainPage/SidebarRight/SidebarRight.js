import React from 'react'
import Search from './Search'
import Profile from './Profile/Profile'
import './sidebarRight.scss'

const SidebarRight = () => {
  return (
    <div className='sidebarRight'>
      <Profile />
      <Search />
    </div>
  )
}

export default SidebarRight