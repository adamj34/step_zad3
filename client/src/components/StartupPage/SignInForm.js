import React from 'react';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import './startupPage.scss'
import * as Yup from 'yup';
import * as yup from 'yup'
import YupPassword from 'yup-password'
import Cookies from 'js-cookie';
YupPassword(yup) 



const RegisterForm = ( {visible} ) => {
	const [serverMsg, setServerMsg] = React.useState('')
	const navigate = useNavigate()

    return visible ? (
    <>  
        <img id='startup_logo' src='/images/twitter_icon.svg' alt='twitter logo' />
		<h4>{serverMsg}</h4>
        <Formik
        initialValues={{name: '', last_name: '', username: '', email: '', password: '',  termsAccepted: false}}
        validationSchema={Yup.object({
            email: Yup.string()
              .email('Invalid email address')
              .required('Please fill out this field'),
            password: Yup.string()
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
              .required('Please fill out this field')
			        .min(2, 'Username has to be longer than 2')
              .max(30, 'Username has to be shorter than 30'),
            termsAccepted: Yup.boolean()
              .oneOf([true], 'Please accept terms and conditions')
            })}
            onSubmit={ (values, { resetForm }) => { 	
				axios.post('https://localhost:8000/signIn', values)
					.then(res => {
						if (res.status === 200 && res.data.msg === 'User created') {
							console.log(res)
							setServerMsg('')
							resetForm()
							localStorage.setItem('user', JSON.stringify(res.data.userData))
              Cookies.set('user', JSON.stringify(res.data.userData), { expires: 30 })
							navigate('/mainPage')
						} else {
							setServerMsg(res.data)
						}
					})
					.catch(err => {console.log(err)})
            }}
        >
        <Form>
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
            <Field name="email" type="email" />
            <ErrorMessage name="email" />

            <label htmlFor='password'>Password</label>
            <Field name='password' type='password' autoComplete="off"/>
            <ErrorMessage name='password'/>
            
            <label htmlFor='termsAccepted'>Accept Terms</label>
            <Field name='termsAccepted' type='checkbox' style={{alignSelf: 'flex-start'}}/>
            <p>By signing up, you agree to the <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a>, including <a href='#'>Cookie Use</a>.</p>
            <ErrorMessage name='termsAccepted'/>
            
            <button type="reset">Reset</button>
            <button type="submit">Submit</button>
    
        </Form>
    </Formik>
    </>
  ) : null
};

export default RegisterForm