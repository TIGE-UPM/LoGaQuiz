import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import logo from '../../../../assets/logaquiz-black.png';

import './QuestionWait.scss';

function QuestionWait({ game }) {
	if (!game) {
		return null;
	}

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	function calculateTimeLeft() {
		const tmpTime = new Date(game.currentQuestion.startTime);
		tmpTime.setMilliseconds(tmpTime.getMilliseconds() + game.currentQuestion.allocatedTime * 1000);
		const newTimeLeft = tmpTime - new Date();
		return newTimeLeft < 0 ? 0 : newTimeLeft / 1000;
	}

	useEffect(() => {
		const timer = setInterval(async () => {
			const newTimeLeft = calculateTimeLeft();
			if (newTimeLeft === 0) {
				clearInterval(timer);
			}
			setTimeLeft(newTimeLeft);
		}, 100);

		return () => clearInterval(timer);
	}, [game]);

	const player = game?.players[0];

	let questionContent = null;

	if (timeLeft > game.currentQuestion.allocatedTime) {
		questionContent = (
			<div className='flex row justify-center p-2'>
				<div className='flex column gap-2 align-items-center'>
					<span className='font-20 font-bold'>Espera a que empiece la pregunta</span>
				</div>
			</div>
		);
	} else if (timeLeft > 0) {
		questionContent = (
			<div className='flex row justify-center p-2'>
				<div className='flex column gap-2 align-items-center'>
					<span className='font-20 font-bold'>Espera a que termine la pregunta</span>
				</div>
			</div>
		);
	} else {
		questionContent = (
			<div className='question-container'>
				<div className='title'>Pregunta {game.currentQuestion.questionOrder}</div>
				<div className='message'>La pregunta va a empezar...</div>
			</div>
		);
	}
	return (
		<div className='question-result-container'>
			<div className='question-result-header flex row justify-space-between align-items-center px-1 font-white'>
				<img src={logo} alt="" />
				<span className='font-8'>Pregunta {game.currentQuestion?.questionOrder}</span>
			</div>
			<div className='question-result-content flex center font-center font-white'>
				{questionContent}
			</div>
			<div className='question-result-footer flex row justify-space-between align-items-center px-1 bg-grey-back'>
				<span className='font-8'>{player?.name}</span>
				<span>{Math.floor(player?.currentScore)} puntos</span>
			</div>
		</div>
	);
}

QuestionWait.propTypes = {
	game: PropTypes.object.isRequired,
};

export default QuestionWait;
