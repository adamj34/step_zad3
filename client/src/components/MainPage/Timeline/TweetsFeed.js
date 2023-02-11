import React, { useEffect, useState, useContext } from 'react'
import { newTweetContext } from './Timeline'
import axios from 'axios'
import SingleTweet from './SingleTweet'
import Cookies from 'js-cookie'

const TweetsFeed = () => {
	const [tweets, setTweets] = useState([])
	const { newTweet } = useContext(newTweetContext)
	
	useEffect(() => {
		axios.get('https://localhost:8000/mainPage/timelineTweets')
			.then(res => {
				setTweets(res.data.reverse())
			})
			.catch(err => {console.log(err)})
	}, [newTweet])
	
  return (
    <div>
        {tweets.map(tweet => <SingleTweet tweetProp={tweet} key={tweet._id} />)}
    </div>
  )
}

export default TweetsFeed