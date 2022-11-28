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

	const [gameStatus, setGameStatus] = useState(null);

	async function loadGameStatus() {
		setGameStatus(await Game.getGameStatus(gameId));
	}

	useEffect(() => {
		loadGameStatus();
		Events.addListener(`game:${gameId}:update`, loadGameStatus);
	}, []);

	if (gameStatus?.status === 'IDLE') {
		return <WaitingRoom game={gameStatus} />;
	}

	if (gameStatus?.status === 'PLAYING') {
		return <Question game={gameStatus} />;
	}

	return <Podium game={gameStatus} />;
}

export default GameScreen;
