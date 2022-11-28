import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import logo from '../../../assets/logaquiz-black.png';

import './Question.scss';

import QuestionWait from './QuestionWait';
import QuestionResult from './QuestionResult';

import * as Game from '../../../store/game';

function Question({ game }) {
	console.log('hola');
	console.log(game);
	if (!game) {
		return null;
	}

	async function onAnswerQuestionClick(answerId) {
		await Game.answerQuestion(game.id, answerId);
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

	const hasAnswered = !!player.responses.find((response) => response.playedQuestionId === game.currentQuestionId);

	if (timeLeft > (game.currentQuestion.allocatedTime) || (timeLeft > 0 && hasAnswered)) {
		return (
			<QuestionWait game={game}></QuestionWait>
		);
	}

	if (timeLeft <= 0) {
		return (
			<QuestionResult game={game}></QuestionResult>
		);
	}

	const symbols = ['●', '▲', '■', '◆'];
	const colors = ['red', 'blue', 'yellow', 'green'];
	const answersPills = game.currentQuestion.playedAnswers.map((answer, index) => (
		<div className='col-6 py-2 flex column align-items-stretch justify-items-center' key={answer.id}>
			<div className={`flex center align-items-center justify-items-stretch question-item p-1 shadow-1 br-1 gap-4 bg-${colors[index]}`} onClick={() => onAnswerQuestionClick(answer.id)}>
				<span className='font-30 font-white shadow-filter font-center'>{symbols[index]}</span>
			</div>
		</div>
	));

	return (

		<div className='question-result-container'>
			<div className='question-result-header flex row justify-space-between align-items-center px-1 font-white'>
				<img src={logo} alt="" />
				<span className='font-8'>Pregunta {game.currentQuestion?.questionOrder}</span>
			</div>
			<div className='question-result-content flex center font-center w-100'>
				<div className='flex column p-1 w-100'>
					<div className='flex row wrap w-100 p-1 w-100'>
						{answersPills}
					</div>
				</div>
			</div>
			<div className='question-result-footer flex row justify-space-between align-items-center px-1 bg-grey-back'>
				<span className='font-8'>{player?.name}</span>
				<span>{Math.floor(player?.currentScore)} puntos</span>
			</div>
		</div>
	);
}

Question.propTypes = {
	game: PropTypes.object.isRequired,
};

export default Question;
