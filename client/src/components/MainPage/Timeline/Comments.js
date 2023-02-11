import axios from 'axios';
import React, { useState, useEffect } from 'react'

const Comments = ({ tweetState, dispatch }) => {
  const [newComment, setNewComment] = useState('');
  const  [commentMsg, setCommentMsg] = useState('');
  const [sentTrigger, setSentTrigger] = useState(false);
  const [firstRender, setfirstRender] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newComment) {
      dispatch({ type: 'add_comment', payload: newComment });
      event.target.reset();
      setSentTrigger(!sentTrigger)
      setCommentMsg('');
    } else {
      setCommentMsg('Please enter a comment first');
    }
  }

  useEffect(() => {
	setfirstRender(false)
	if (!firstRender) {
		axios.post('https://localhost:8000/mainPage/timelineTweets/singleTweet/comment', {postId: tweetState._id, comment: newComment})
		setNewComment('')
	}
  }, [sentTrigger]);

  return (
    <div className='comments'>
      {tweetState.comments.map((comment, inx) => <p key={inx}>{comment}</p>)}
	  
      <form onSubmit={handleSubmit}>
        <textarea 
          type="text" 
          onChange={(event) => setNewComment(event.target.value)}
          placeholder="Add a comment..." 
        />
        <button type="submit">Submit</button>
      </form>
      {commentMsg ? <p id='empty_comm_msg'>{commentMsg}</p> : null}
    </div>
  )
}

export default Comments