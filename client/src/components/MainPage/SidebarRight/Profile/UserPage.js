import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './userPage.scss'
import SingleTweet from '../../Timeline/SingleTweet'
import Chat from './Chat'

const UserPage = () => {
	const following = JSON.parse(localStorage.getItem('user')).following
	const currUserId = JSON.parse(localStorage.getItem('user'))._id

    const { userId } = useParams()
    const [userData, setUserData] = useState({})
	const [openedChat, setOpenedChat] = useState(false)
	
	const [isFollower, setIsFollower] = useState(following.includes(userId))

	const [allPosts, setAllPosts] = useState([])
	const [showLikedTweets, setShowLikedTweets] = useState(false)

    useEffect(() => {
        axios.get(`https://localhost:8000/mainPage/profile/${userId}`)
			.then(res => setUserData(res.data.user))
			.catch(err => console.log(err))

		if (!showLikedTweets) {
			if (following.includes(userId)) {
				axios.get(`https://localhost:8000/mainPage/profile/posts/${userId}`, {params: {isFollower: true}})
					.then(res => {setAllPosts(res.data.posts)
					console.log(res.data.posts)})
					.catch(err => console.log(err))
			} else {
				axios.get(`https://localhost:8000/mainPage/profile/posts/${userId}`, {params: {isFollower: false}})
					.then(res => {setAllPosts(res.data.posts)
					console.log(res.data.posts)})
					.catch(err => console.log(err))
			}
		} else {
			axios.get(`https://localhost:8000/mainPage/profile/likedPosts/${userId}`)
				.then(res => {setAllPosts(res.data.posts)
				console.log(res.data.posts)})
				.catch(err => console.log(err))
		}
    }, [isFollower, showLikedTweets])

	const handleFollow = () => {
		if (isFollower) {
			axios.post(`https://localhost:8000/mainPage/profile/follow/${userId}`, {followerId: currUserId, action: 'unfollow'})
			const user = JSON.parse(localStorage.getItem('user'))
			user.following = user.following.filter(follower => follower !== userData._id)
			localStorage.setItem('user', JSON.stringify(user))
			setIsFollower(false)
		} else {
			axios.post(`https://localhost:8000/mainPage/profile/follow/${userId}`, {followerId: currUserId, action: 'follow'})
			const user = JSON.parse(localStorage.getItem('user'))
			user.following.push(userData._id)
			localStorage.setItem('user', JSON.stringify(user))
			setIsFollower(true)
		}
	}

  return (
    <div className='userPage'>
        <h5>{userData.username}</h5>
        <img src={userData.picture ? userData.picture : '/images/default_profile_pic.png'} alt="profile pic"></img> 
        <p>{`${userData.name} ${userData.last_name}`}</p>
        <button id='followBtn' onClick={() => handleFollow()}>{isFollower ? 'Unfollow' : 'Follow'}</button>
		<button id='messageBtn' onClick={() => setOpenedChat(!openedChat)}>{!openedChat ? "Message" : "Hide chat"}</button>
		<button id='switchTweetsBtn' onClick={() => setShowLikedTweets(!showLikedTweets)}>{showLikedTweets ? `Show ${userData.username}'s tweets` : `Show tweets liked by ${userData.username}`}</button>
		{allPosts.map((tweet) => <SingleTweet tweetProp={tweet} key={tweet._id} />)}
		{openedChat ? <Chat userData={userData} /> : null}
    </div>
  )
}

export default UserPage