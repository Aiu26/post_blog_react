import React from 'react';
import Input from '../../shared/FormElements/Input';
import Button from '../../shared/FormElements/Button';
import Card from '../../shared/UIElements/Card';
import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './Auth.css';
import ImageUpload from '../../shared/FormElements/ImageUpload';
import { useState, useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';

const Auth = () => {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: '',
				isValid: false,
			},
			password: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const switchModeHandler = () => {
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
						value: '',
						isValid: false,
					},
				},
				false
			);
		}
		setIsLoginMode((prevMode) => !prevMode);
	};

	const authSubmitHandler = async (event) => {
		event.preventDefault();

		if (isLoginMode) {
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + '/users/login',
					'POST',
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{
						'Content-Type': 'application/json',
					}
				);
				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		} else {
			try {
				const formData = new FormData();
				formData.append('email', formState.inputs.email.value);
				formData.append('name', formState.inputs.name.value);
				formData.append('password', formState.inputs.password.value);
				formData.append('image', formState.inputs.image.value);
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + '/users/signup',
					'POST',
					formData
				);
				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={() => clearError()} />
			<Card className='authentication'>
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>Login Required</h2>
				<hr />
				<form onSubmit={authSubmitHandler}>
					{!isLoginMode && (
						<Input
							element='input'
							id='name'
							type='text'
							label='Your Name'
							validators={[VALIDATOR_MINLENGTH(5)]}
							errorText='Please enter a valid name, at least 5 characters.'
							onInput={inputHandler}
						/>
					)}
					{!isLoginMode && (
						<ImageUpload
							center
							id='image'
							onInput={inputHandler}
							errorText='Please provide an image'
						/>
					)}
					<Input
						element='input'
						id='email'
						type='email'
						label='E-Mail'
						validators={[VALIDATOR_EMAIL()]}
						errorText='Please enter a valid email address.'
						onInput={inputHandler}
					/>
					<Input
						element='input'
						id='password'
						type='password'
						label='Password'
						validators={[VALIDATOR_MINLENGTH(6)]}
						errorText='Please enter a valid password, at least 6 characters.'
						onInput={inputHandler}
					/>
					<Button type='submit' disabled={!formState.isValid}>
						{isLoginMode ? 'LOGIN' : 'SIGNUP'}
					</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>
					SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
				</Button>
			</Card>
		</React.Fragment>
	);
};

export default Auth;
