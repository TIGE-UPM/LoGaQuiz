const express = require('express');
const ExcelJS = require('exceljs');

const { Game, PlayedTest, PlayedQuestion, PlayedAnswer, Player, Test, Question, Answer, Response } = require('../db/models');

const { userIsAdmin, userIsPlayer } = require('../utils/router');
const { emitToPlayer, emitToGame, emitToAdmin } = require('../utils/events');
const { CustomError } = require('../errors');

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ------------------------------------------           ROUTES FOR GAMES               ----------------------------------------------- */

const router = express.Router();

// Endpoint for creating a new game
router.post('/', userIsAdmin, async (req, res, next) => {
	const { testId } = req.body;

	let newGame = null;
	while (true) {
		try {
			newGame = await Game.create({
				id: getRandomInt(100000000, 999999999),
				status: 'IDLE',
			});
			break;
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError' && error.fields.includes('id')) {
				continue;
			}
			console.log(error);
			throw error;
		}
	}

	const test = await Test.findOne({
		where: {
			id: testId,
		},
		include: {
			model: Question,
			include: {
				model: Answer,
			},
		},
	});

	const { id: playedTestId } = await PlayedTest.create({
		title: `${test.title}`,
		image: `${test.image}`,
		testId: test.id,
		gameId: newGame.id,
	});

	for (const question of test.questions) {
		const { id: playedQuestionId } = await PlayedQuestion.create({
			title: `${question.title}`,
			image: `${question.image}`,
			questionType: `${question.questionType}`,
			allocatedTime: question.allocatedTime,
			questionOrder: question.questionOrder,
			weight: question.weight,
			playedTestId,
		});
		for (const answer of question.answers) {
			await PlayedAnswer.create({
				title: `${answer.title}`,
				isCorrect: answer.isCorrect,
				playedQuestionId,
			});
		}
	}

	// const createdGame = await Test.createNewGame(testId);
	res.send(newGame);
});

/**
 * Sends an array of all the games
 * @return res Array of all game titles and IDs
 */
router.get('/all', userIsAdmin, async (req, res, next) => {
	const games = await Game.findAll({
		order: [['startTime', 'DESC']],
		include: {
			model: PlayedTest,
			include: {
				model: PlayedQuestion,
			},
		},
	});
	res.send(games);
});

/**
 * Sends all the information of the specified game
 * @params req.params.gameId Id of the required game
 * @return res Game with the specified Id with its players and responses
 */
router.get('/:gameId', userIsAdmin, async (req, res, next) => {
	const { gameId } = req.params;
	const selectedGame = await Game.findOne({
		where: {
			id: gameId,
		},
		include: [
			{
				model: PlayedTest,
				include: [{
					model: PlayedQuestion,
					include: [
						{ model: PlayedAnswer },
					],
				}],
			},
			{
				model: PlayedQuestion,
				as: 'currentQuestion',
				include: [
					{ model: PlayedAnswer },
					{ model: Response },
				],
			},
			{
				model: Player,
			},
		],
	});
	res.send(selectedGame);
});

/**
 * Sends all the information of the specified game
 * @params req.params.gameId Id of the required game
 * @return res Game with the specified Id with its players and responses
 */
router.get('/:gameId/status', async (req, res, next) => {
	try {
		const { gameId } = req.params;
		const playerId = req.session.games?.[gameId];
		if (!playerId) {
			throw new CustomError('No estás jugando a este juego', 'not_playing_game', 401);
		}

		const game = await Game.findOne({
			where: {
				id: gameId,
			},
			include: [
				{
					model: PlayedTest,
				},
				{
					model: PlayedQuestion,
					as: 'currentQuestion',
					include: [
						{
							model: PlayedAnswer,
							attributes: ['id', 'title'],
						},
					],
				},
				{
					model: Player,
					where: {
						id: playerId,
					},
					include: {
						model: Response,
					},
				},
			],
		});

		res.send(game);
	} catch (error) {
		next(error);
	}
});

/**
 * Deletes all the information of the specified game
 * @params req.params.gameId Id of the required game
 */
router.delete('/:gameId', userIsAdmin, async (req, res, next) => {
	await Test.deleteGameById(req.params.gameId);
	res.sendStatus(204);
});

// Endpoint for creating a Player for specified test instance
router.post('/:gameId/join', async (req, res, next) => {
	try {
		const { playerName } = req.body;
		const { gameId } = req.params;
		console.log(gameId);
		console.log(req.session);
		if (req.session.games?.[gameId]) {
			const playerId = req.session.games?.[gameId];
			await Player.update({ name: playerName }, {
				where: {
					id: playerId,
				},
			});
			emitToGame(gameId, `game:${gameId}:update`);
			emitToAdmin(gameId, `game:${gameId}:update`);
			res.sendStatus(204);
			return;
		}

		const game = await Game.findOne({
			where: {
				id: gameId,
			},
		});

		if (!game) {
			throw new CustomError('El juego no existe', 'game_not_exist', 401);
		}
		if (game.status !== 'IDLE') {
			throw new CustomError('El juego ya ha empezado', 'game_already_started', 401);
		}

		const createdPlayer = await Player.create({
			name: `${playerName}`,
			gameId,
		});

		if (!req.session.games) {
			req.session.games = {};
		}
		req.session.games[gameId] = createdPlayer.id;
		req.session.isPlayer = true;

		emitToGame(gameId, `game:${gameId}:update`);
		emitToAdmin(gameId, `game:${gameId}:update`);

		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
});

// Endpoint for starting specified Game
router.post('/:gameId/start', userIsAdmin, async (req, res, next) => {
	const { gameId } = req.params;

	const firstQuestion = await PlayedQuestion.findOne({
		where: {
			questionOrder: 1,
			'$PlayedTest.gameId$': gameId,
		},
		include: {
			model: PlayedTest,
		},
	});

	await Game.update({ startTime: Date.now(), currentQuestionId: firstQuestion.id, status: 'PLAYING' }, {
		where: {
			id: gameId,
			startTime: null,
		},
	});

	await PlayedQuestion.update({ startTime: Date.now() + 5000 }, {
		where: {
			id: firstQuestion.id,
		},
	});

	emitToGame(gameId, `game:${gameId}:update`);
	emitToAdmin(gameId, `game:${gameId}:update`);

	res.sendStatus(204);
});

// Endpoint for creating a Response for specified Game
router.post('/:gameId/answer', userIsPlayer, async (req, res, next) => {
	try {
		const arrivedTime = new Date();

		const { gameId } = req.params;
		const { answerId } = req.body;

		const playerId = req.session.games?.[gameId];
		if (!playerId) {
			throw new CustomError('No estás jugando a este juego', 'not_playing_game', 401);
		}

		const answer = await PlayedAnswer.findOne({
			where: {
				id: answerId,
			},
			include: [
				{
					model: PlayedQuestion,
					include: {
						model: PlayedTest,
						include: {
							model: Game,
							where: {
								id: gameId,
							},
							include: {
								model: Player,
							},
						},
					},
				},
			],
		});

		if (!answer) {
			throw new CustomError('No existe la respuesta que has marcado', 'answer_not_exist', 401);
		}

		const ellapsedTime = arrivedTime - answer.playedQuestion.startTime;

		if (ellapsedTime < 0) {
			throw new CustomError('La pregunta todavía no ha empezado', 'question_not_started', 401);
		}

		const { allocatedTime, weight } = answer.playedQuestion;

		if (ellapsedTime > allocatedTime * 1000) {
			throw new CustomError('Ya se ha terminado el tiempo para responder a esta pregunta', 'no_time_left', 401);
		}

		console.log(answer);
		console.log(weight);
		console.log(ellapsedTime);
		console.log(allocatedTime);
		let score = 0;
		if (answer.isCorrect) {
			score = ellapsedTime < 500 ? answer.weight : weight * (1 - (ellapsedTime / (allocatedTime * 1000)) / 2);
		}
		console.log(score);
		try {
			await Response.create({
				answerTime: ellapsedTime,
				gameId,
				playerId,
				score,
				playedQuestionId: answer.playedQuestion.id,
				playedAnswerId: answer.id,
			});
			await Player.increment('currentScore', { by: score, where: { id: playerId } });
		} catch (error) {
			throw new CustomError('Ya has respondido a esta pregunta', 'question_already_answered', 401);
		}

		emitToPlayer(playerId, `game:${gameId}:update`);
		emitToAdmin(playerId, `game:${gameId}:update`);
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
});

// Endpoint for creating a Response for specified Game
router.get('/:gameId/question/:questionId/is-correct', userIsPlayer, async (req, res, next) => {
	try {
		const { gameId, questionId } = req.params;

		const playerId = req.session.games?.[gameId];
		if (!playerId) {
			throw new CustomError('No estás jugando a este juego', 'not_playing_game', 401);
		}

		const response = await Response.findOne({
			where: {
				playedQuestionId: questionId,
				playerId,
			},
			include: [
				{
					model: PlayedAnswer,
				},
			],
		});

		if (!response) {
			throw new CustomError('No has respondido a esta pregunta', 'question_not_answered', 401);
		}

		res.send(response.playedAnswer.isCorrect);
	} catch (error) {
		next(error);
	}
});

// Endpoint for creating a Response for specified Game
router.get('/:gameId/position', userIsPlayer, async (req, res, next) => {
	try {
		const { gameId } = req.params;

		const playerId = req.session.games?.[gameId];
		if (!playerId) {
			throw new CustomError('No estás jugando a este juego', 'not_playing_game', 401);
		}

		const playersPodium = await Player.findAll({
			where: {
				gameId,
			},
			order: [
				['currentScore', 'DESC'],
			],
		});

		console.log(playersPodium);

		const playerPosition = playersPodium.findIndex((player) => player.id === parseInt(playerId, 10));

		console.log(playerPosition);

		res.send({ position: playerPosition + 1 });
	} catch (error) {
		next(error);
	}
});

// Endpoint for moving to the next question in specified Game
router.post('/:gameId/next-question', userIsAdmin, async (req, res, next) => {
	try {
		const { gameId } = req.params;
		console.log(gameId);
		const game = await Game.findOne({
			where: {
				id: gameId,
			},
			include: [
				{
					model: PlayedQuestion,
					as: 'currentQuestion',
				},
			],
		});
		console.log(game);
		if (!game) {
			throw new CustomError('El juego no existe', 'game_not_exist', 401);
		}

		if (game.status !== 'PLAYING') {
			throw new CustomError('Este juego no se está jugando', 'not_playing_game', 401);
		}

		let nextQuestion;
		if (game.currentQuestion === null) {
			nextQuestion = await PlayedQuestion.findOne({
				where: {
					questionOrder: 1,
					'$PlayedTest.gameId$': gameId,
				},
				include: {
					model: PlayedTest,
				},
			});
		} else {
			nextQuestion = await PlayedQuestion.findOne({
				where: {
					questionOrder: game.currentQuestion.questionOrder + 1,
					'$PlayedTest.gameId$': gameId,
				},
				include: {
					model: PlayedTest,
				},
			});
		}

		if (nextQuestion) {
			await PlayedQuestion.update({ startTime: Date.now() + 5000 }, {
				where: {
					id: nextQuestion.id,
				},
			});
			await Game.update({ currentQuestionId: nextQuestion.id }, {
				where: {
					id: gameId,
				},
			});
		} else {
			await Game.update({ currentQuestionId: null, status: 'FINISHED' }, {
				where: {
					id: gameId,
				},
			});
		}

		emitToGame(gameId, `game:${gameId}:update`);
		emitToAdmin(gameId, `game:${gameId}:update`);

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

router.get('/:gameId/report/download', userIsAdmin, async (req, res, next) => {
	try {
		const { gameId } = req.params;
		console.log(gameId);
		const game = await Game.findOne({
			where: {
				id: gameId,
			},
			include: [
				{
					model: PlayedQuestion,
					as: 'currentQuestion',
				},
				{
					model: PlayedTest,
					include: [
						{
							model: PlayedQuestion,
							separate: true,
							order: [
								['questionOrder', 'ASC'],
							],
							include: [
								{
									model: PlayedAnswer,
								},
							],
						},
					],
				},
				{
					model: Player,
					order: [
						['currentScore', 'DESC'],
					],
					include: [
						{
							model: Response,
							separate: true,
							include: [
								{
									model: PlayedQuestion,
								},
								{
									model: PlayedAnswer,
								},
							],
							order: [
								[PlayedQuestion, 'questionOrder', 'ASC'],
							],
						},
					],
				},
				{
					model: Response,
					separate: true,
					include: [
						{
							model: PlayedQuestion,
						},
						{
							model: PlayedAnswer,
						},
					],
					order: [
						[PlayedQuestion, 'questionOrder', 'ASC'],
					],
				},
			],
		});
		const gameObj = JSON.parse(JSON.stringify(game));
		console.log(gameObj);
		console.log(gameObj.players[0].responses);
		console.log(gameObj.responses);
		console.log(Response.associations);
		if (!game) {
			throw new CustomError('El juego no existe', 'game_not_exist', 401);
		}

		const workbook = new ExcelJS.Workbook();

		const overviewSheet = workbook.addWorksheet('Overview');

		overviewSheet.getRow(1).getCell(1).value = game.playedTest.title;

		const dateRow = overviewSheet.getRow(2);
		dateRow.getCell(1).value = 'Fecha';
		dateRow.getCell(2).value = game.playedAt;

		const playersRow = overviewSheet.getRow(3);
		playersRow.getCell(1).value = 'Jugadores';
		playersRow.getCell(2).value = game.players.length;

		const questionsRow = overviewSheet.getRow(4);
		questionsRow.getCell(1).value = 'Preguntas';
		questionsRow.getCell(2).value = game.playedTest.playedQuestions.length;

		overviewSheet.getRow(6).getCell(1).value = 'Overall Performance';

		const correctAnswers = game.responses.filter((response) => response.playedAnswer.isCorrect).length;
		const incorrectAnswers = game.responses.filter((response) => !response.playedAnswer.isCorrect).length;

		const correctAnswersRow = overviewSheet.getRow(7);
		correctAnswersRow.getCell(1).value = 'Total correct answers';
		correctAnswersRow.getCell(2).value = `${correctAnswers} (${((correctAnswers / game.responses.length) * 100).toFixed(2)}%)`;

		const incorrectAnswersRow = overviewSheet.getRow(8);
		incorrectAnswersRow.getCell(1).value = 'Total incorrect answers';
		incorrectAnswersRow.getCell(2).value = `${incorrectAnswers} (${((incorrectAnswers / game.responses.length) * 100).toFixed(2)}%)`;

		const averagePoints = game.players.reduce((acc, player) => acc + player.currentScore, 0) / game.players.length;

		const averageScoreRow = overviewSheet.getRow(9);
		averageScoreRow.getCell(1).value = 'Average score (points)';
		averageScoreRow.getCell(2).value = `${averagePoints.toFixed(2)} points`;

		const scoresSheet = workbook.addWorksheet('Final Scores');

		scoresSheet.getRow(1).getCell(1).value = game.playedTest.title;
		scoresSheet.getRow(2).getCell(1).value = 'Final Scores';
		scoresSheet.getRow(3).values = ['Rank', 'Player', 'Total Score (points)', 'Correct Answers', 'Incorrect Answers'];

		game.players.forEach((player, index) => {
			const row = scoresSheet.getRow(index + 4);
			row.getCell(1).value = index + 1;
			row.getCell(2).value = player.name;
			row.getCell(3).value = player.currentScore;
			row.getCell(4).value = game.responses.filter((response) => response.playerId === player.id && response.playedAnswer.isCorrect).length;
			row.getCell(5).value = game.responses.filter((response) => response.playerId === player.id && !response.playedAnswer.isCorrect).length;
		});

		const questionsSheet = workbook.addWorksheet('Questions');

		questionsSheet.getRow(1).getCell(1).value = game.playedTest.title;
		questionsSheet.getRow(2).getCell(1).value = 'Questions';
		const questionsHeaderRow = questionsSheet.getRow(3);
		questionsHeaderRow.values = ['Rank', 'Player', 'Total Score (points)'];
		game.playedTest.playedQuestions.forEach((playedQuestion, index) => {
			questionsHeaderRow.getCell((index * 2) + 4).value = `Q${index + 1}`;
			questionsHeaderRow.getCell((index * 2) + 5).value = playedQuestion.title;
		});
		game.players.forEach((player, index) => {
			const row = questionsSheet.getRow(index + 4);
			row.getCell(1).value = index + 1;
			row.getCell(2).value = player.name;
			row.getCell(3).value = player.currentScore;
			game.playedTest.playedQuestions.forEach((playedQuestion, questionIndex) => {
				const { allocatedTime, weight } = playedQuestion;
				const playerResponse = player.responses.find((response) => response.playedQuestionId === playedQuestion.id);
				if (!playerResponse) {
					row.getCell((questionIndex * 2) + 4).value = 0;
					row.getCell((questionIndex * 2) + 5).value = '';
					return;
				}
				let score = 0;
				if (playerResponse.playedAnswer.isCorrect) {
					score = playerResponse.answerTime < 500 ? playerResponse.playedAnswer.weight : weight * (1 - (playerResponse.answerTime / (allocatedTime * 1000)) / 2);
				}
				row.getCell((questionIndex * 2) + 4).value = score;
				row.getCell((questionIndex * 2) + 5).value = playerResponse.playedAnswer.title;
			});
		});

		game.playedTest.playedQuestions.forEach((playedQuestion, index) => {
			const responses = game.responses.filter((response) => response.playedQuestionId === playedQuestion.id);
			const questionSheet = workbook.addWorksheet(`Q${index + 1}`);
			questionSheet.getRow(1).getCell(1).value = game.playedTest.title;

			const questionRow = questionSheet.getRow(2);
			questionRow.getCell(1).value = `Question ${index + 1}`;
			questionRow.getCell(2).value = playedQuestion.title;

			const correctAnswerRow = questionSheet.getRow(3);
			correctAnswerRow.getCell(1).value = 'Correct Answers';
			correctAnswerRow.getCell(2).value = playedQuestion.playedAnswers.filter((playedAnswer) => playedAnswer.isCorrect).map((answer) => answer.title).join(', ');

			const playersCorrectRow = questionSheet.getRow(4);
			playersCorrectRow.getCell(1).value = 'Players correct';
			playersCorrectRow.getCell(2).value = `${((responses.filter((response) => response.playedAnswer.isCorrect).length / game.players.length) * 100).toFixed(2)}%`;

			const durationRow = questionSheet.getRow(5);
			durationRow.getCell(1).value = 'Duration';
			durationRow.getCell(2).value = `${playedQuestion.allocatedTime} seconds`;

			questionSheet.getRow(7).getCell(1).value = 'Answer Summary';

			const answerOptionsRow = questionSheet.getRow(8);
			answerOptionsRow.values = ['Answer Options', ...playedQuestion.playedAnswers.map((playedAnswer) => playedAnswer.title)];

			const answerCorrectRow = questionSheet.getRow(9);
			answerCorrectRow.values = ['Is answer correct?', ...playedQuestion.playedAnswers.map((playedAnswer) => (playedAnswer.isCorrect ? '✔︎' : '✘'))];

			const answersReceivedRow = questionSheet.getRow(10);
			answersReceivedRow.values = ['Number of answers received', ...playedQuestion.playedAnswers.map((playedAnswer) => responses.filter((response) => response.playedAnswerId === playedAnswer.id).length)];

			const averageTimeRow = questionSheet.getRow(11);
			averageTimeRow.values = ['Average time taken (seconds)', ...playedQuestion.playedAnswers.map((playedAnswer) => {
				const answerResponses = responses.filter((response) => response.playedAnswerId === playedAnswer.id);
				return answerResponses.length === 0 ? 0 : (answerResponses.reduce((acc, response) => acc + response.answerTime, 0) / answerResponses.length) / 1000;
			})];

			questionSheet.getRow(13).getCell(1).value = 'Player Responses';

			const playerHeaderRow = questionSheet.getRow(14);
			playerHeaderRow.values = ['Player', 'Is Correct?', 'Answer', 'Score', 'Answer Time (seconds)'];

			game.players.forEach((player, playerIndex) => {
				const { allocatedTime, weight } = playedQuestion;
				const playerResponse = player.responses.find((response) => response.playedQuestionId === playedQuestion.id);
				if (!playerResponse) {
					const row = questionSheet.getRow(playerIndex + 15);
					row.getCell(1).value = player.name;
					row.getCell(2).value = '-';
					row.getCell(3).value = '';
					row.getCell(4).value = 0;
					row.getCell(5).value = allocatedTime;
					return;
				}
				let score = 0;
				if (playerResponse.playedAnswer.isCorrect) {
					score = playerResponse.answerTime < 500 ? playerResponse.playedAnswer.weight : weight * (1 - (playerResponse.answerTime / (allocatedTime * 1000)) / 2);
				}
				const row = questionSheet.getRow(playerIndex + 15);
				row.getCell(1).value = player.name;
				row.getCell(2).value = playerResponse.playedAnswer.isCorrect ? '✔︎' : '✘';
				row.getCell(3).value = playerResponse.playedAnswer.title;
				row.getCell(4).value = score;
				row.getCell(5).value = playerResponse.answerTime / 1000;
			});
		});

		res.attachment('Report.xlsx');
		return await workbook.xlsx.write(res);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

module.exports = {
	router,
};
