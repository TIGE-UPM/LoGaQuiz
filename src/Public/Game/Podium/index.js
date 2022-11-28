import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import logo from '../../../assets/logaquiz-black.png';

import './Podium.scss';

import * as Game from '../../../store/game';

function Podium({ game }) {
	if (!game) {
		return null;
	}

	const [position, setPosition] = useState(null);
	useEffect(() => {
		(async () => {
			setPosition(await Game.getPlayerPosition(game.id));
		})();
	}, [game]);

	const player = game?.players[0];

	let result = null;

	if (position === null) {
		result = (
			<div className='question-result-container'>
				Cargando
			</div>
		);
	} else {
		result = (
			<div className='flex row justify-center p-2'>
				<div className='flex column gap-2 align-items-center'>
					<span className='font-20 font-bold font-white'>Posición:</span>
					<span className='font-20 font-bold font-white'>{position}</span>
				</div>
			</div>
		);
	}

	return (
		<div className='question-result-container'>
			<div className='question-result-header flex row justify-space-between align-items-center px-1 font-white'>
				<img src={logo} alt="" />
			</div>
			<div className='question-result-content flex center font-center'>
				{result}
			</div>
			<div className='question-result-footer flex row justify-space-between align-items-center px-1 bg-grey-back'>
				<span className='font-8'>{player?.name}</span>
				<span>{Math.floor(player?.currentScore)} puntos</span>
			</div>
		</div>
	);
}

Podium.propTypes = {
	game: PropTypes.object.isRequired,
};

export default Podium;
