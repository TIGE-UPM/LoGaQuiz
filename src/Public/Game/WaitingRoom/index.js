import React from 'react';
import PropTypes from 'prop-types';

import './WaitingRoom.scss';

function WaitingRoom({ game }) {
	console.log(game);
	if (!game) {
		return null;
	}

	return (
		<div className='flex row justify-center p-2'>
			<div className='flex column gap-2 align-items-center mt-5'>
				<div className='font-20 font-bold font-white'>Test: {game.playedTest.title}</div>
				<div className='font-8 font-white mt-2'>¡Ya estás dentro del juego {game.players[0].name}!</div>
			</div>
		</div>
	);
}

WaitingRoom.propTypes = {
	game: PropTypes.object.isRequired,
};

export default WaitingRoom;
