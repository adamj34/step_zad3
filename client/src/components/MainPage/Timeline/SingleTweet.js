import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useLayoutEffect, useRef, useReducer, useContext } from 'react'
import Comments from './Comments'
import { newTweetContext } from './Timeline'
import tweetReducer from './tweetReducer.js'


const SingleTweet = ( { tweetProp } ) => {
	const { newTweet, setNewTweet } = useContext(newTweetContext)

	// const userId = JSON.parse(localStorage.getItem('user'))._id
	const userId = JSON.parse(Cookies.get('user'))._id
	const alreadyLiked = tweetProp.likedBy.includes(userId)

	const initialState = {...tweetProp, showComments: false, liked: alreadyLiked}
	const [tweetState, dispatch] = useReducer(tweetReducer, initialState)

	const firstRender = useRef(0)

	const handleDeletion = () => {
		axios.delete(`https://localhost:8000/mainPage/timelineTweets/singleTweet/delete/${tweetState._id}`)
			.then(res => {
				console.log(res)
				setNewTweet(!newTweet)
			})
			.catch(err => console.log(err))
	}

	useLayoutEffect(() => {
		if (firstRender.current < 2) {
			firstRender.current += 1
			return
		}

		if ((tweetProp.likes - 1 === tweetState.likes)) {
			axios.put('https://localhost:8000/mainPage/timelineTweets/singleTweet/likes', {postId: tweetState._id, likes: tweetState.likes, likedBy: userId, operationOnlikedBy: 'pull'})
				.then(res => console.log(res))
		} else if ((tweetProp.likes + 1 === tweetState.likes)) {
			axios.put('https://localhost:8000/mainPage/timelineTweets/singleTweet/likes', {postId: tweetState._id, likes: tweetState.likes, likedBy: userId, operationOnlikedBy: 'push'})
				.then(res => console.log(res))
		}
	}, [tweetState.likes])

	const handleLikes = () => {
		dispatch({ type: 'toggle_liked' })
		tweetState.liked ? dispatch({ type: 'decrement_likes'}) : dispatch({ type: 'increment_likes'}) 
	}
    
  return (
    <div className='singleTweet'>
		<img id='profilePic' src={tweetState.author.length > 0 && tweetState.author[0].picture ? tweetState.author[0].picture : '/images/default_profile_pic.png'} alt="profile pic" ></img>
		<h3>{tweetState.authorUsername}</h3>
        <p>{tweetState.tweetContent}</p>
        {tweetState.tweetPic ? <img src={tweetState.tweetPic} alt="tweet"></img> : null}
		<div className='buttons_tweets'>
			<button onClick={() => handleLikes()}>{`${tweetState.liked ? 'Unlike' : 'Like'}: ${tweetState.likes}`}</button>
			<button onClick={() => dispatch({ type: 'show_comments' })}>{`${tweetState.showComments ? 'Hide comments' : 'Comments'}`}</button>
		</div>
		{tweetState.showComments ? <Comments tweetState={tweetState} dispatch={dispatch} /> : null}
        <p>{new Date(tweetState.createdAt).toLocaleString('en-GB',{day:'numeric', month: 'numeric',  year:'numeric'})}</p>
		{userId === tweetState.postedBy ? <button id='delBtn' onClick={() => handleDeletion()}>Delete</button> : null}
    </div>
  )
}

export default SingleTweet