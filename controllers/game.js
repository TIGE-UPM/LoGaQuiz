const express = require('express');
const { Test } = require('../db/models');

const { userIsAdmin, userIsPlayer } = require('../utils/router');

/* ------------------------------------------           ROUTES FOR GAMES               ----------------------------------------------- */

const gameRouter = express.Router();

// Endpoint for creating a new game
gameRouter.post('/', userIsAdmin, async (req, res, next) => {
	const newGame = req.body;
	const createdGame = await Test.createNewGame(newGame);
	res.send(createdGame);
});

/**
 * Sends an array of all the games
 * @return res Array of all game titles and IDs
 */
gameRouter.get('/all', userIsAdmin, async (req, res, next) => {
	const allGames = await Test.getAllGames();
	res.send(allGames);
});

/**
 * Sends all the information of the specified game
 * @params req.params.gameId Id of the required game
 * @return res Game with the specified Id with its players and responses
 */
gameRouter.get('/:gameId', userIsAdmin, async (req, res, next) => {
	const selectedGame = await Test.getGameById(req.params.gameId);
	res.send(selectedGame);
});

/**
 * Deletes all the information of the specified game
 * @params req.params.gameId Id of the required game
 */
gameRouter.delete('/:gameId', userIsAdmin, async (req, res, next) => {
	await Test.deleteGameById(req.params.gameId);
	res.sendStatus(204);
});

// Endpoint for creating a Player for specified test instance
gameRouter.post('/:gameId/join', async (req, res, next) => {
	const playerName = req.body.name;
	const { gameId } = req.params;
	const createdPlayer = await Test.createPlayer(playerName, gameId);
	req.session.playerId = createdPlayer.id;
	req.session.isPlayer = true;
	res.sendStatus(204);
});

// Endpoint for starting specified Game
gameRouter.post('/:gameId/start', userIsAdmin, async (req, res, next) => {
	const gameStarted = await Test.startGame(req.params.gameId);
	res.sendStatus(204);
});

// Endpoint for creating a Response for specified Game
gameRouter.post('/:gameId/answer', userIsPlayer, async (req, res, next) => {
	const { gameId } = req.params;
	const { answerId } = req.body;
	const { playerId } = req.session;
	const createdResponse = await Test.createResponse(answerId, gameId, playerId);
	res.sendStatus(204);
});

// Endpoint for ending specified Game
gameRouter.post('/:gameId/end', userIsAdmin, async (req, res, next) => {
	const gameEnded = await Test.endGame(req.params.gameId);
	res.sendStatus(204);
});

// Endpoint for moving to the next question in specified Game
gameRouter.post('/:gameId/next-question', userIsAdmin, async (req, res, next) => {
	const { gameId } = req.params;
	const nextQuestionObtained = await Test.nextQuestion(gameId);
	// res.send(nextQuestionObtained);
	if (nextQuestionObtained === null) {
		res.send(404);
	} else { res.sendStatus(204); }
});

module.exports = {
	router: gameRouter,
};
