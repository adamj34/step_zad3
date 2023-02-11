import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RegisterForm from './SignInForm'
import LogInForm from './LogInForm'
import Header from './Header'
import './startupPage.scss'

const StartupPage = () => {
	const [signIn, setSignIn] = React.useState(false)
	const [logIn, setLogIn] = React.useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		if (localStorage.getItem('user')) navigate('/mainPage')
	}, [])


    return (
	<>
		<Header />
		<div className='startup_page'>
			
			<div className='startup_left'>
				<img id='wallpaper_img' src='/images/twitter_wallpaper.svg' alt='twitter wallpaper' />
			</div>

			<div className='startup_right'>
				<div className='sign_in_form'>
					<h4>New to Twitter?</h4>
					<button onClick={() => setSignIn(!signIn)}>Sign up</button>
					<RegisterForm visible={signIn}/>
				</div>

				<div className='log_in_form'>
					<h4>Already have an account?</h4>
					<button onClick={() => setLogIn(!logIn)}>Log In</button>
					<LogInForm visible={logIn} />
				</div>


			</div>
    	</div>
	</>
  )
}

export default StartupPage