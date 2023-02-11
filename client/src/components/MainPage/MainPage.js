import React from 'react'
import SidebarLeft from "./SidebarLeft/SidebarLeft";
import Timeline from './Timeline/Timeline';
import SidebarRight from './SidebarRight/SidebarRight';
import './mainPage.scss'


const MainPage = () => {
  return (
    <div className='mainPage'>
        <SidebarLeft />
        <Timeline />
        <SidebarRight />
    </div>
  )
}

export default MainPage