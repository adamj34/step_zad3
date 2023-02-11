import Cookies from 'js-cookie'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const LogOut = () => {
    const navigate = useNavigate()
    return (
        <button onClick={() => {
            localStorage.clear();
            Cookies.remove('user')
            navigate('/')
        }}>Log Out</button>
  )
}

export default LogOut