import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './QuestionWait.scss';

function QuestionWait({ game }) {
	if (!game) {
		return null;
	}

	const [timeToStart, setTimeToStart] = useState(calculateTimeToStart());

	function calculateTimeToStart() {
		const newTimeToStart = new Date(game.currentQuestion.startTime) - new Date();
		return newTimeToStart < 0 ? 0 : newTimeToStart / 1000;
	}

	useEffect(() => {
		const timer = setInterval(async () => {
			const newTimeToStart = calculateTimeToStart();
			if (newTimeToStart === 0) {
				clearInterval(timer);
			}
			setTimeToStart(newTimeToStart);
		}, 100);
		console.log(timer);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className='flex row justify-center p-2'>
			<div className='flex column gap-2 align-items-center font-white mt-5'>
				<div className='font-20 font-bold font-white'>Pregunta {game.currentQuestion.questionOrder}</div>
				<div className='font-20 font-bold'>{Math.ceil(timeToStart)}</div>
				<div className='font-8'>La pregunta va a empezar...</div>
			</div>
		</div>
	);
}

QuestionWait.propTypes = {
	game: PropTypes.object.isRequired,
};

export default QuestionWait;
