const { Test, Question, Answer, PlayedTest, PlayedQuestion, PlayedAnswer, Game, Player, Response } = require('./models');

/* ------------------------------------------------------- Database functions -------------------------------------------*/

// Tests

/**
 * Creates the specified test
 * @param test
 */
async function createNewTest(test) {
	const { id: testId } = await Test.create({ title: `${test.title}` });
	let questionOrder = 1;
	// console.log(test);
	// console.log(test.questions);
	for (const question of test.questions) {
		const { id: questionId } = await Question.create({
			title: `${question.title}`,
			question_type: `${question.question_type}`,
			allocated_time: question.allocated_time,
			question_order: questionOrder,
			weight: question.weight,
			test_id: testId,
		});
		for (const answer of question.answers) {
			await Answer.create({
				title: `${answer.title}`,
				is_correct: answer.is_correct,
				question_id: questionId,
			});
		}
		questionOrder += 1;
	}
	const createdTest = await getTestById(testId);
	if (!createdTest) {
		console.log('There was an error creating the test');
		return null;
	}
	return createdTest;
}

async function updateTest(testId, test) {
	const [rowsUpdated] = await Test.update({ title: `${test.title}` }, { where: { id: testId } });
	if (!rowsUpdated) {
		console.log('There was an error updating the test');
		return null;
	}

	let questionOrder = 1;
	// console.log(test);
	// console.log(test.questions);
	await Question.update({ questionOrder: null }, { where: { test_id: testId } });
	for (const question of test.questions) {
		let { id: questionId } = question;
		if (questionId) {
			await Question.update({
				title: `${question.title}`,
				question_type: `${question.question_type}`,
				allocated_time: question.allocated_time,
				question_order: questionOrder,
				weight: question.weight,
				test_id: testId,
			}, { where: { id: questionId } });
		} else {
			questionId = (await Question.create({
				title: `${question.title}`,
				question_type: `${question.question_type}`,
				allocated_time: question.allocated_time,
				question_order: questionOrder,
				weight: question.weight,
				test_id: testId,
			})).id;
		}

		for (const answer of question.answers) {
			const { id: answerId } = answer;
			if (answerId) {
				await Answer.update({
					title: `${answer.title}`,
					is_correct: answer.is_correct,
					question_id: questionId,
				}, { where: { id: answerId } });
			} else {
				await Answer.create({
					title: `${answer.title}`,
					is_correct: answer.is_correct,
					question_id: questionId,
				});
			}
		}
		questionOrder += 1;
	}
	await Question.destroy({ where: { test_id: testId, questionOrder: null } });

	const updatedTest = await getTestById(testId);
	if (!updatedTest) {
		console.log('There was an error creating the test');
		return null;
	}
	return updatedTest;
}

/**
 * Creates the specified played test, played questions and played answers
 * @param  test
 * @param gameId
 */
async function createNewPlayedTest(test, gameId) {
	console.log(test);
	console.log(gameId);
	const { id: playedTestId } = await PlayedTest.create({
		title: `${test.title}`,
		image: `${test.image}`,
		test_id: test.id,
		game_id: gameId,
	});

	for (const question of test.Questions) {
		const { id: playedQuestionId } = await PlayedQuestion.create({
			title: `${question.title}`,
			image: `${question.image}`,
			question_type: `${question.question_type}`,
			allocated_time: question.allocated_time,
			question_order: question.question_order,
			weight: question.weight,
			played_test_id: playedTestId,
		});
		for (const answer of question.Answers) {
			await PlayedAnswer.create({
				title: `${answer.title}`,
				is_correct: answer.is_correct,
				played_question_id: playedQuestionId,
			});
		}
	}
	const createdPlayedTest = await getPlayedTestById(playedTestId);
	if (!createdPlayedTest) {
		console.log('There was an error creating the played test');
		return null;
	}
	return createdPlayedTest;
}

/**
 * Function that returns an array with the id, title and image of all tests
 * @returns Test array
 */
async function getAllTests() {
	const allTests = await Test.findAll({
		attributes: ['id', 'title', 'image'],
	});
	console.log(allTests);
	return allTests;
}

/**
 * Returns an array with all the test information
 * @param testId
 * @returns complete test
 */
async function getTestById(testId) {
	const selectedTest = await Test.findOne({
		where: {
			id: testId,
		},
		include: {
			model: Question,
			include: {
				model: Answer,
			},
		},
		order: [[Question, 'question_order', 'ASC']],
	});
	if (!selectedTest) {
		console.log("There isn't a test with that ID");
		return null;
	}

	return selectedTest;
}

/**
 * Returns an array with all the played test information
 * @param playedTestId
 * @returns complete played test
 */
async function getPlayedTestById(playedTestId) {
	const selectedPlayedTest = await PlayedTest.findOne({
		where: {
			id: playedTestId,
		},
		include: {
			model: PlayedQuestion,
			include: {
				model: PlayedAnswer,
			},
		},
		order: [[PlayedQuestion, 'question_order', 'ASC']],
	});
	if (!selectedPlayedTest) {
		console.log("There isn't a test with that ID");
		return null;
	}

	return selectedPlayedTest;
}

/**
 * Deletes the specified test
 * @param testId
 */
async function deleteTestById(testId) {
	await Test.destroy({
		where: {
			id: testId,
		},
	});
}

// Games

/**
 * Creates the specified game
 * @param game
 */
async function createNewGame(game) {
	const createdGame = await Game.create({
		status: 'IDLE',
	});
	const realTest = await getTestById(game.testId);
	const createdPlayedTest = await createNewPlayedTest(realTest, createdGame.id);
	if (!createdPlayedTest) {
		console.log('There was an error creating the test');
		return null;
	}
	return createdPlayedTest;
}

/**
 * Function that returns an array with the id, title and image of all games
 * @returns Game array
 */
async function getAllGames() {
	const allGames = await Game.findAll({
		attributes: ['played_at'],
		include: {
			model: PlayedTest,
			attributes: ['id', 'title', 'image'],
		},
	});
	return allGames;
}

/**
 * Returns an array with all the test information
 * @param testId
 * @returns complete test
 */
async function getGameById(gameId) {
	const selectedGame = await Game.findOne({
		where: {
			id: gameId,
		},
		include: {
			model: Player,
			include: {
				model: Response,
			},
		},
		// order: [[Player, 'ranking', 'ASC']],
	});
	if (!selectedGame) {
		console.log("There isn't a game with that ID");
		return null;
	}

	return selectedGame;
}

/**
 * Deletes the specified game
 * @param gameId
 */
async function deleteGameById(gameId) {
	await Game.destroy({
		where: {
			id: gameId,
		},
	});
}

/**
 * Starts game with specified gameId
 * @param gameId
 */
async function startGame(gameId) {
	const firstQuestion = await getFirstGameQuestion(gameId);
	await Game.update({ played_at: Date.now(), current_question: firstQuestion.id, status: 'PLAYING' }, {
		where: {
			id: gameId,
			played_at: null,
		},
	});
	await PlayedQuestion.update({ start_time: Date.now() }, {
		where: {
			id: firstQuestion.id,
		},
	});
}

/**
 * Returns the question with the question order = 1 and with the specified testId
 * @param gameId
 * @returns First question of the game
 */
async function getFirstGameQuestion(gameId) {
	// const { id: testId } = await PlayedTest.findOne({
	// 	where: {
	// 		game_id: gameId,
	// 	},
	// });
	const firstQuestion = await PlayedQuestion.findOne({
		where: {
			question_order: 1,
		},
		include: {
			model: PlayedTest,
			where: {
				game_id: gameId,
			},
		},
	});
	return firstQuestion;
}

async function createPlayer(playerName, gameId) {
	const createdPlayer = await Player.create({
		name: `${playerName}`,
		game_id: gameId,
	});
	return createdPlayer;
}

async function createResponse(answerId, gameId, playerId) {
	const playedAnswer = await PlayedAnswer.findOne({
		where: {
			id: answerId,
		},
	});
	const playedTest = await PlayedTest.findOne({
		where: {
			game_id: gameId,
		},
	});
	const playedQuestion = await PlayedQuestion.findOne({
		where: {
			id: playedAnswer.played_question_id,
		},
	});
	const currentPlayer = await Player.findOne({
		where: {
			id: playerId,
		},
	});
	// console.log(`Start time: ${playedQuestion.start_time}`);
	// console.log(typeof playedQuestion.start_time);
	// console.log(`Answer time: ${Date.now()}`);
	// console.log(typeof Date.now());
	const diference = Date.now() - playedQuestion.start_time;
	// console.log(`Time diference: ${diference}`);
	// console.log(typeof diference);
	if ((parseInt(gameId, 10) === currentPlayer.game_id) && (playedQuestion.played_test_id === playedTest.id)) {
		const createdResponse = await Response.create({
			answer_time: diference,
			game_id: gameId,
			player_id: playerId,
			played_question_id: playedAnswer.played_question_id,
			played_answer_id: answerId,
		});
		return createdResponse;
	}
	console.log('Error creating the response');
	return null;
}

async function endGame(gameId) {
	const gameEnded = await Game.update({ current_question: null, status: 'PLAYING' }, {
		where: {
			id: gameId,
		},
	});
	return gameEnded;
}

/**
 * Returns the question with the question order = 1 and with the specified testId
 * @param gameId
 * @returns First question of the game
 */
async function getNextGameQuestion(gameId, currentQuestionId) {
	const { id: testId } = await PlayedTest.findOne({
		where: {
			game_id: gameId,
		},
	});
	const currentOne = await PlayedQuestion.findByPk(currentQuestionId);
	const nextQuestionObject = await PlayedQuestion.findOne({
		where: {
			played_test_id: testId,
			question_order: currentOne.question_order + 1,
		},
	});
	if (nextQuestion === null) {
		console.log('There aren\'t any more questions in this test');
	}
	return nextQuestionObject;
}

async function nextQuestion(gameId) {
	const currentGame = await Game.findByPk(gameId);
	console.log(currentGame);
	const nextQuestionFound = await getNextGameQuestion(gameId, currentGame.current_question);
	if (nextQuestionFound === null) {
		console.log("Error fetching next question, maybe there aren't any more");
		return null;
	}
	await Game.update({ current_question: nextQuestionFound.id }, {
		where: {
			id: gameId,
		},
	});
	await PlayedQuestion.update({ start_time: Date.now() }, {
		where: {
			id: nextQuestionFound.id,
		},
	});
	return nextQuestionFound;
}

getFirstGameQuestion(1);

module.exports = {
	createNewTest,
	updateTest,
	getAllTests,
	getTestById,
	deleteTestById,
	createNewGame,
	getAllGames,
	getGameById,
	deleteGameById,
	startGame,
	createPlayer,
	createResponse,
	endGame,
	nextQuestion,
};
