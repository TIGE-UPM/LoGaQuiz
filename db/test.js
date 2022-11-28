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
			questionType: `${question.questionType}`,
			allocatedTime: question.allocatedTime,
			questionOrder,
			weight: question.weight,
			testId,
		});
		for (const answer of question.answers) {
			await Answer.create({
				title: `${answer.title}`,
				isCorrect: answer.isCorrect,
				questionId,
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
	await Question.update({ questionOrder: null }, { where: { testId } });
	for (const question of test.questions) {
		let { id: questionId } = question;
		if (questionId) {
			await Question.update({
				title: `${question.title}`,
				questionType: `${question.questionType}`,
				allocatedTime: question.allocatedTime,
				questionOrder,
				weight: question.weight,
				testId,
			}, { where: { id: questionId } });
		} else {
			questionId = (await Question.create({
				title: `${question.title}`,
				questionType: `${question.questionType}`,
				allocatedTime: question.allocatedTime,
				questionOrder,
				weight: question.weight,
				testId,
			})).id;
		}

		for (const answer of question.answers) {
			const { id: answerId } = answer;
			if (answerId) {
				await Answer.update({
					title: `${answer.title}`,
					isCorrect: answer.isCorrect,
					questionId,
				}, { where: { id: answerId } });
			} else {
				await Answer.create({
					title: `${answer.title}`,
					isCorrect: answer.isCorrect,
					questionId,
				});
			}
		}
		questionOrder += 1;
	}
	await Question.destroy({ where: { testId, questionOrder: null } });

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
	const { id: playedTestId } = await PlayedTest.create({
		title: `${test.title}`,
		image: `${test.image}`,
		testId: test.id,
		gameId,
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
		attributes: ['id', 'title', 'image', 'createdAt', 'updatedAt'],
	});
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
		order: [[Question, 'questionOrder', 'ASC']],
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
		order: [[PlayedQuestion, 'questionOrder', 'ASC']],
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
async function createNewGame(testId) {
	const createdGame = await Game.create({
		status: 'IDLE',
	}, { plain: true, returning: true });
	console.log(createdGame);
	const realTest = await getTestById(testId);
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
		attributes: ['startTime'],
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
		include: [
			{
				model: Player,
				include: {
					model: Response,
				},
			},
			{
				model: PlayedTest,
				include: {
					model: PlayedQuestion,
					include: {
						model: PlayedAnswer,
					},
				},
			},
		],
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
	await Game.update({ startTime: Date.now(), currentQuestion: firstQuestion.id, status: 'PLAYING' }, {
		where: {
			id: gameId,
			startTime: null,
		},
	});
	await PlayedQuestion.update({ startTime: Date.now() }, {
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
	// 		gameId: gameId,
	// 	},
	// });
	const firstQuestion = await PlayedQuestion.findOne({
		where: {
			questionOrder: 1,
		},
		include: {
			model: PlayedTest,
			where: {
				gameId,
			},
		},
	});
	return firstQuestion;
}

async function createPlayer(playerName, gameId) {
	const createdPlayer = await Player.create({
		name: `${playerName}`,
		gameId,
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
			gameId,
		},
	});
	const playedQuestion = await PlayedQuestion.findOne({
		where: {
			id: playedAnswer.playedQuestionId,
		},
	});
	const currentPlayer = await Player.findOne({
		where: {
			id: playerId,
		},
	});
	// console.log(`Start time: ${playedQuestion.startTime}`);
	// console.log(typeof playedQuestion.startTime);
	// console.log(`Answer time: ${Date.now()}`);
	// console.log(typeof Date.now());
	const diference = Date.now() - playedQuestion.startTime;
	// console.log(`Time diference: ${diference}`);
	// console.log(typeof diference);
	if ((parseInt(gameId, 10) === currentPlayer.gameId) && (playedQuestion.playedTestId === playedTest.id)) {
		const createdResponse = await Response.create({
			answerTime: diference,
			gameId,
			playerId,
			playedQuestionId: playedAnswer.playedQuestionId,
			playedAnswerId: answerId,
		});
		return createdResponse;
	}
	console.log('Error creating the response');
	return null;
}

async function endGame(gameId) {
	const gameEnded = await Game.update({ currentQuestion: null, status: 'PLAYING' }, {
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
			gameId,
		},
	});
	const currentOne = await PlayedQuestion.findByPk(currentQuestionId);
	const nextQuestionObject = await PlayedQuestion.findOne({
		where: {
			playedTestId: testId,
			questionOrder: currentOne.questionOrder + 1,
		},
	});
	if (nextQuestion === null) {
		console.log('There aren\'t any more questions in this test');
	}
	return nextQuestionObject;
}

async function nextQuestion(gameId) {
	const currentGame = await Game.findByPk(gameId);
	const nextQuestionFound = await getNextGameQuestion(gameId, currentGame.currentQuestion);
	if (nextQuestionFound === null) {
		console.log("Error fetching next question, maybe there aren't any more");
		return null;
	}
	await Game.update({ currentQuestionId: nextQuestionFound.id }, {
		where: {
			id: gameId,
		},
	});
	await PlayedQuestion.update({ startTime: Date.now() }, {
		where: {
			id: nextQuestionFound.id,
		},
	});
	return nextQuestionFound;
}

// getFirstGameQuestion(1);

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
