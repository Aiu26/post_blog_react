import React from 'react';
import './PlaceList.css';
import Card from '../../shared/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/FormElements/Button';

const PlaceList = (props) => {
	if (props.items.length === 0) {
		return (
			<div className='place-list'>
				<Card>
					<h2>No places found. Create a new place!</h2>
					<Button to='/places/new'>Create Place</Button>
				</Card>
			</div>
		);
	}

	return (
		<ul className='place-list'>
			{props.items.map((place) => (
				<PlaceItem
					key={place.id}
					id={place.id}
					image={place.image}
					title={place.title}
					description={place.description}
					address={place.address}
					creatorId={place.creator}
					coordinates={place.location}
					onDelete={props.onDeletePlace}
				/>
			))}
		</ul>
	);
};

export default PlaceList;
