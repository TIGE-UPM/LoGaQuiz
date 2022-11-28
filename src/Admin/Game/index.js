import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './Game.scss';

import WaitingRoom from './WaitingRoom';
import Question from './Question';
import Podium from './Podium';

import * as Game from '../../store/game';
import Events from '../../events';

function GameScreen() {
	const { gameId } = useParams();

	const [game, setGame] = useState(null);

	async function loadGame() {
		setGame(await Game.getGame(gameId));
	}

	useEffect(() => {
		loadGame();
		console.log(`game:${gameId}:update`);
		Events.addListener(`game:${gameId}:update`, loadGame);
	}, []);

	if (!game) {
		return null;
	}

	let content = null;

	if (game.status === 'IDLE') {
		content = <WaitingRoom game={game} />;
	} else if (game.status === 'PLAYING') {
		content = <Question game={game} />;
	} else {
		content = <Podium game={game} />;
	}
	return (
		<div className='game-container w-100 h-100'>
			{content}
		</div>
	);
}

export default GameScreen;
