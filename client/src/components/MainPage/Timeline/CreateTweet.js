import React, { useContext } from 'react'
import axios from 'axios';
import { newTweetContext } from './Timeline'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import getBase64 from '../../../utils/base64_encoding';

const CreateTweet = () => {
	const [file, setFile] = React.useState('')
	const [serverMessage, setServerMessage] = React.useState('')

	const { newTweet, setNewTweet } = useContext(newTweetContext)
	const handeleOnChange = async (e) => {
		const img_base64 = await getBase64(e.target.files[0])
		setFile(img_base64)
	}


  return (
    <div className='createTweet'>
	<Formik
		initialValues={{ tweetContent: '', private: false}}
		validationSchema={Yup.object({
			tweetContent: Yup.string()
				.max(280, 'The limit of 280 characters exceeded'),
		})}
		onSubmit={(values, { resetForm }) => {
			values.postedBy = JSON.parse(localStorage.getItem('user'))._id
			values.authorUsername = JSON.parse(localStorage.getItem('user')).username
			values.tweetPic = file
			axios.post('https://localhost:8000/mainPage/newTweet', values)
				.then(res => {
					if (res.status === 200 && res.data.msg === 'Tweet added') {
						console.log(res)
						setServerMessage('')
						setFile('')
						setNewTweet(!newTweet)
						resetForm()
					} else {
						setServerMessage(res.data)
					}
				})
				.catch(err => {console.log(err)})
		}}
		>
		
		<Form>
			<Field name="tweetContent" component="textarea" placeholder="What's happening?" rows="4"/>
			<ErrorMessage name="tweetContent" />

			<label id='private-button'>
				<Field type="checkbox" name="private" />
				Private 
          	</label>

			{file ? <img src={file} alt="tweet"></img> : null}

			<label htmlFor="tweetPic">Add Image</label>
			<input type="file" id='tweetPic' accept="image/png, image/jpeg, image/jpg" onChange={(e) => handeleOnChange(e)}/>

			<button type="submit">Submit</button>
		</Form>
		</Formik>
		<p>{serverMessage}</p>
		
    </div>
  ) 
}

export default CreateTweet