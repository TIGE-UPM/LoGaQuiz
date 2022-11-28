import React from 'react';
import PropTypes from 'prop-types';

import './Lobby.scss';

import * as Game from '../../../store/game';

function Lobby({ game }) {
	console.log(game);
	if (!game) {
		return null;
	}

	async function onStartClick() {
		await Game.nextQuestion(game.id);
	}

	return (
		<div className='lobby-container'>
			<div className='title'>{game.playedTest.title}</div>
			<button onClick={onStartClick}>Empezar</button>
		</div>
	);
}

Lobby.propTypes = {
	game: PropTypes.object.isRequired,
};

export default Lobby;
