import React from 'react'
import { createContext } from 'react'
import CreateTweet from './CreateTweet'
import TweetsFeed from './TweetsFeed'
import './timeline.scss'


export const newTweetContext = createContext({})

export const Timeline = () => {
	const [newTweet, setNewTweet] = React.useState(false)
	
  return (
	<newTweetContext.Provider value={{newTweet, setNewTweet}}>
		<div className='timeline'>
			<header className='timeline_header'>
				<h2>Home</h2>
			</header>
			<CreateTweet />
			<TweetsFeed />
		</div>
	</newTweetContext.Provider>
  )
}

export default Timeline