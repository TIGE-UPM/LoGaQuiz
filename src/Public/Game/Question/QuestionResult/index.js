import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import logo from '../../../../assets/logaquiz-black.png';

import './QuestionResult.scss';

import * as Game from '../../../../store/game';

function QuestionResult({ game }) {
	const [isCorrect, setIsCorrect] = useState(null);
	if (!game) {
		return null;
	}

	useEffect(() => {
		(async () => {
			setIsCorrect(await Game.getQuestionIsCorrect(game.id, game.currentQuestionId));
		})();
	}, [game]);

	const player = game?.players[0];

	const hasAnswered = !!player?.responses.find((response) => response.playedQuestionId === game.currentQuestionId);

	let result = null;

	if (!hasAnswered) {
		result = (
			<div className='flex row justify-center p-2'>
				<div className='flex column gap-2 align-items-center'>
					<span className='font-20 font-bold font-white'>Ha acabado el tiempo para contestar</span>
				</div>
			</div>
		);
	} else if (isCorrect === null) {
		result = (
			<div className='question-result-container'>
				Cargando
			</div>
		);
	} else if (isCorrect) {
		result = (
			<div className='flex row justify-center p-2'>
				<div className='flex column gap-2 align-items-center'>
					<span className='font-20 font-bold font-white'>Has acertado</span>
				</div>
			</div>
		);
	} else {
		result = (
			<div className='flex row justify-center p-2'>
				<div className='flex column gap-2 align-items-center'>
					<span className='font-20 font-bold font-white'>Fallaste</span>
				</div>
			</div>
		);
	}

	return (
		<div className='question-result-container'>
			<div className='question-result-header flex row justify-space-between align-items-center px-1 font-white'>
				<img src={logo} alt="" />
				<span className='font-8'>Pregunta {game.currentQuestion?.questionOrder}</span>
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

QuestionResult.propTypes = {
	game: PropTypes.object.isRequired,
};

export default QuestionResult;
