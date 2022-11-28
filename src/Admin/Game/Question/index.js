import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './Question.scss';

import Components from '@Components';
import * as Game from '../../../store/game';

import QuestionWait from './QuestionWait';

const { ButtonLink } = Components;

function Question({ game }) {
	console.log(game);
	if (!game) {
		return null;
	}

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	function calculateTimeLeft() {
		const tmpTime = new Date(game.currentQuestion.startTime);
		tmpTime.setMilliseconds(tmpTime.getMilliseconds() + game.currentQuestion.allocatedTime * 1000);
		const newTimeLeft = tmpTime - new Date();
		console.log(newTimeLeft);
		return newTimeLeft < 0 ? 0 : newTimeLeft / 1000;
	}

	useEffect(() => {
		const timer = setInterval(async () => {
			const newTimeLeft = calculateTimeLeft();
			console.log(newTimeLeft);
			if (newTimeLeft === 0) {
				clearInterval(timer);
			}
			setTimeLeft(newTimeLeft);
		}, 100);
		setTimeLeft(calculateTimeLeft());
		console.log(timer);
		return () => clearInterval(timer);
	}, [game]);

	async function onNextQuestionClick() {
		await Game.nextQuestion(game.id);
	}

	console.log(timeLeft);
	console.log(game.currentQuestion.allocatedTime);
	if (timeLeft > game.currentQuestion.allocatedTime) {
		return <QuestionWait game={game}></QuestionWait>;
	}

	const symbols = ['●', '▲', '■', '◆'];
	const colors = ['red', 'blue', 'yellow', 'green'];
	const answersPills = game.currentQuestion.playedAnswers.map((answer, index) => {
		if (!timeLeft) {
			return (
				<div className='col-6 p-1 flex column align-items-stretch justify-items-center' key={answer.id}>
					<div className={`flex align-items-center justify-items-stretch question-item p-1 shadow-1 br-1 gap-4 ${answer.isCorrect ? 'bg-green-correct' : 'bg-red-wrong'}`}>
						<span className='font-30 font-white shadow-filter'>{symbols[index]}</span>
						<span className='font-20 font-white'>{answer.title}</span>
					</div>
				</div>
			);
		}

		return (
			<div className='col-6 p-1 flex column align-items-stretch justify-items-center' key={answer.id}>
				<div className={`flex align-items-center justify-items-stretch question-item p-1 shadow-1 br-1 gap-4 bg-${colors[index]}`}>
					<span className='font-30 font-white shadow-filter'>{symbols[index]}</span>
					<span className='font-20 font-white'>{answer.title}</span>
				</div>
			</div>
		);
	});

	let statusContainer = null;
	if (timeLeft) {
		statusContainer = (
			<div className='flex column center font-white'>
				<div className='font-15 font-bold'>Tiempo restante:</div>
				<div className='font-15 font-bold'>{Math.ceil(timeLeft)}s</div>
			</div>
		);
	}

	let nextQuestionButton = null;
	if (!timeLeft) {
		nextQuestionButton = <ButtonLink style="button" onClick={onNextQuestionClick}>Siguiente Pregunta</ButtonLink>;
	}
	return (
		<div className='flex row justify-center py-2'>
			<div className='flex column gap-2 align-items-center justify-items-center w-100 mt-1'>
				<div className='font-20 font-bold font-white'>Pregunta {game.currentQuestion.questionOrder}</div>
				<div className='font-15 w-100 font-center py-4 font-bold bg-white'>{game.currentQuestion.title}</div>
				{statusContainer}
				<div className='flex row wrap w-100 p-1'>
					{answersPills}
				</div>
				{nextQuestionButton}
			</div>
		</div>
	);
}

Question.propTypes = {
	game: PropTypes.object.isRequired,
};

export default Question;
