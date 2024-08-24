import React, { useContext } from 'react';
import Input from '../../shared/FormElements/Input';
import './PlaceForm.css';
import {
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import Button from '../../shared/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/FormElements/ImageUpload';
import { useHistory } from 'react-router-dom';

const NewPlaces = () => {
	const history = useHistory();
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [formState, inputHandler] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
			address: {
				value: '',
				isValid: false,
			},
			image: {
				value: null,
				isValid: false,
			},
		},
		false
	);

	const placeSubmitHandler = async (event) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('title', formState.inputs.title.value);
		formData.append('description', formState.inputs.description.value);
		formData.append('address', formState.inputs.address.value);
		formData.append('creator', auth.userId);
		formData.append('image', formState.inputs.image.value);

		try {
			await sendRequest(
				process.env.REACT_APP_BACKEND_URL + '/places',
				'POST',
				formData,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			);
			history.push('/');
		} catch (err) {}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />

			<form className='place-form' onSubmit={placeSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id='title'
					element='input'
					type='text'
					label='Title'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid title.'
					onInput={inputHandler}
				/>
				<Input
					id='description'
					element='textarea'
					label='Description'
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText='Please enter a valid descriprtion(atleast of 5 characters).'
					onInput={inputHandler}
				/>
				<Input
					id='address'
					element='input'
					label='Address'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid address.'
					onInput={inputHandler}
				/>
				<ImageUpload
					center
					id='image'
					onInput={inputHandler}
					errorText='Please provide an image'
				/>
				<Button type='submit' disabled={!formState.isValid}>
					ADD PLACE
				</Button>
			</form>
		</React.Fragment>
	);
};

export default NewPlaces;
