import React from 'react';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import Cookies from 'js-cookie';
YupPassword(yup);

const LogInForm = ( {visible} ) => {
	const [serverMsg, setServerMsg] = React.useState('')
	const navigate = useNavigate()

    return visible ? (
    <>
    <img id='startup_logo' src='/images/twitter_icon.svg' alt='twitter logo' />
	<h4>{serverMsg}</h4>
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email('Invalid email address')
          .required('Please fill out this field'),
        password: Yup.string()
          .password('')
          .required('Please fill out this field'),
      })}
      onSubmit={(values, { resetForm }) => {
			axios.post('https://localhost:8000/logIn', values)
				.then(res => {
					if (res.status === 200 && res.data.msg === 'User logged in') {
						console.log(res)
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
        <label htmlFor="email">Email Address</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" />

        <label htmlFor="password">Password</label>
        <Field name="password" type="password" />
        <ErrorMessage name="password" />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
    </>
   ) :  null;
    
};

export default LogInForm;
