function tweetReducer(state, action) {
	switch (action.type) {
		case 'increment_likes':
			return {...state, likes: state.likes + 1}
		case 'decrement_likes':
			return {...state, likes: state.likes - 1}
		case 'add_comment':
			return {...state, comments: [...state.comments, action.payload]}
		case 'show_comments':
			return {...state, showComments: !state.showComments}
		case 'toggle_liked':
			return {...state, liked: !state.liked}
		default:
			return state
	}
}

export default tweetReducer