import React from 'react';
import './PlaceItem.css';
import Card from '../../shared/UIElements/Card';
import Button from '../../shared/FormElements/Button';
import Modal from '../../shared/UIElements/Modal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useState } from 'react';
import Map from '../../shared/UIElements/Map';
import { useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';

const PlaceItem = (props) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);
	const [showMap, setShowMap] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const openMapHandler = () => setShowMap(true);
	const closeMapHandler = () => setShowMap(false);

	const showDeleteWarningHandler = () => {
		setShowConfirmModal(true);
	};

	const cancelDeleteHandler = () => {
		setShowConfirmModal(false);
	};

	const confirmDeleteHandler = async () => {
		setShowConfirmModal(false);
		try {
			await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
				'DELETE',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			);
			props.onDelete(props.id);
		} catch (err) {}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />

			<Modal
				show={showMap}
				onCancel={closeMapHandler}
				header={props.address}
				contentClass='place-item__modal-content'
				footerClass='place-item__modal-actions'
				footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
			>
				<div className='map-container'>
					<h2>The Map!</h2>
					<Map center={props.coordinates} zoom={16} />
				</div>
			</Modal>

			<Modal
				show={showConfirmModal}
				onCancel={cancelDeleteHandler}
				header='Are you sure?'
				footerClass='place-item__modal-actions'
				footer={
					<React.Fragment>
						<Button inverse onClick={cancelDeleteHandler}>
							CANCEL
						</Button>
						<Button danger onClick={confirmDeleteHandler}>
							DELETE
						</Button>
					</React.Fragment>
				}
			>
				<p>Do you want to proceed and delete this place?</p>
			</Modal>

			<li className='place-item'>
				<Card className='place-item__content'>
					{isLoading && (
						<div className='center'>
							<LoadingSpinner asOverlay />
						</div>
					)}
					<div className='place-item__image'>
						<img
							src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
							alt={props.title}
						/>
					</div>
					<div className='place-item__info'>
						<h2>{props.title}</h2>
						<h3>{props.address}</h3>
						<p>{props.description}</p>
					</div>
					<div className='place-item__actions'>
						<Button inverse onClick={openMapHandler}>
							View on Map
						</Button>
						{auth.userId === props.creatorId && (
							<Button to={`/places/${props.id}`}>Edit</Button>
						)}
						{auth.userId === props.creatorId && (
							<Button danger onClick={showDeleteWarningHandler}>
								Delete
							</Button>
						)}
					</div>
				</Card>
			</li>
		</React.Fragment>
	);
};

export default PlaceItem;
