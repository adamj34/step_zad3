import React, { useReducer } from 'react';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import editProfileReducer from './editProfileReducer';
import './editProfile.scss'
import * as Yup from 'yup';
import * as yup from 'yup'
import YupPassword from 'yup-password'
import getBase64 from '../../../utils/base64_encoding';
YupPassword(yup) 


const EditProfile = () => {

    const initialState = {serverMsg: '', file: '', passwordConfirmationDeletion: ''}
    const [state, dispatch] = useReducer(editProfileReducer, initialState)

	const navigate = useNavigate()
    const userData = JSON.parse(localStorage.getItem('user'))
    const dbId = userData._id

    const handleDeletion = () => {
        axios.delete(`https://localhost:8000/mainPage/editProfile/deleteAccount`, {data: {dbId: dbId, current_password: state.passwordConfirmationDeletion}})
            .then(res => {
                if (res.status === 200 && res.data === 'User deleted') {
                    localStorage.removeItem('user')
                    navigate('/')
                } else {
                    dispatch({ type: 'set_msg', payload: res.data })
                }
            })
            .catch(err => console.log(err))
    }
     

    return (
    <div className='editProfile'>  
        <h2>Edit your profile</h2>
		<h4>{state.serverMsg}</h4>
        <img src={userData.picture ? userData.picture : '/images/default_profile_pic.png'} alt='user pic'></img>
        <Formik
        initialValues={{pic: userData.picture, name: userData.name, last_name: userData.last_name, username: userData.username, email: userData.email, current_password: '', new_password: ''}}
        validationSchema={Yup.object({
            email: Yup.string()
              .email('Invalid email address')
              .required('Please fill out this field'),
            current_password: Yup.string()
              .password('')
              .required('Please fill out this field'),
            name: Yup.string()
              .min(2, 'Name has to be longer than 2')
              .max(30, 'Name has to be shorter than 30')
              .required('Please fill out this field'),
            last_name: Yup.string()
              .min(2, 'Name has to be longer than 2')
              .max(50, 'Name has to be shorter than 50')
              .required('Please fill out this field'),
            username: Yup.string()
              .min(2, 'Username has to be longer than 2')
              .max(30, 'Username has to be shorter than 30')
              .required('Please fill out this field'),
            })}
            onSubmit={async (values, { resetForm }) => { 	
                if (state.file) {
                    const img_base64 = await getBase64(state.file.target.files[0])
                    values.pic = img_base64
                }                
                values.dbId = dbId
				axios.put('https://localhost:8000/mainPage/editProfile', values)
					.then(res => {
						if (res.status === 200 && res.data.msg === 'User updated') {
							console.log(res)
                            dispatch({ type: 'set_msg', payload: '' })
							resetForm()
                            userData.name = res.data.userData.name
                            userData.last_name = res.data.userData.last_name
                            userData.username = res.data.userData.username
                            userData.email = res.data.userData.email
                            userData.picture = res.data.userData.picture
                            localStorage.setItem('user', JSON.stringify(userData))
							navigate('/mainPage')
						} else {
                            dispatch({ type: 'set_msg', payload: res.data })
						}
					})
					.catch(err => {console.log(err)})
            }}
        >

        <Form>
            <label htmlFor="pic">Change Profile Picture</label>
            <input name="pic" type="file" accept="image/png, image/jpeg, image/jpg" onChange={(e) => dispatch({ type: 'set_file', payload: e})}/>
            <ErrorMessage name="pic"/>

            <label htmlFor="name">Name</label>
            <Field name="name" type="text" />
            <ErrorMessage name="name"/>

            <label htmlFor="last_name">Last Name</label>
            <Field name="last_name" type="text" />
            <ErrorMessage name="last_name"/>

            <label htmlFor="username">Username</label>
            <Field name="username" type="text" />
            <ErrorMessage name="username"/>

            <label htmlFor='email'>Email</label>
            <Field name="email" type="text" />
            <ErrorMessage name="email" />

            <label htmlFor='current_password'>Confirm Your Password</label>
            <Field name='current_password' type='password' autoComplete="on"/>
            <ErrorMessage name='current_password'/>

            <label htmlFor='new_password'>New Password</label>
            <Field name='new_password' type='password' autoComplete="on"/>
            <ErrorMessage name='new_password'/>
            
            <button type="submit">Confirm all changes</button>
            <button type="reset">Undo all changes</button>
    
        </Form>
    </Formik>


    <label>Confirm Your Password</label>
    <input type='password' onChange={(e) => dispatch({ type: 'set_password_confirmation_deletion', payload: e.target.value })}></input>
    <button id='delBtn' onClick={() => handleDeletion()}>Delete Your Account</button>
    </div>
)};

export default EditProfile