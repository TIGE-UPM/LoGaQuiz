const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store);

const app = express();
const port = 3000;

const { getSettings } = require('./settings');
const db = require('./db');
const Test = require('./db/test');

const testRouter = express.Router();
const gameRouter = express.Router();
const authRouter = express.Router();

app.use(cookieParser());
app.use(express.json());

app.use(expressSession({
	secret: 'keep it secret, keep it safe.',
	store: new SessionStore({ db }),
}));

/* --------------------------------------          ROUTES FOR TEST           ----------------------------------------- */

/**
 * Creates a test with the information sent in the request body
 * @param req.body The test information, containing its questions and its answers
 * @return res The created test
 */
testRouter.post('/', async (req, res, next) => {
	const newCompleteTest = req.body;
	const createdTest = await Test.createNewTest(newCompleteTest);
	res.send(createdTest);
});

/**
 * Sends an array of all the tests
 * @return res Array of all test titles and IDs
 */
testRouter.get('/all', async (req, res, next) => {
	const allTests = await Test.getAllTests();
	res.send(allTests);
});

/**
 * Sends all the information of the specified test
 * @params req.params.testId Id of the required test
 * @return res Test with the specified Id with its questions and anwers
 */
testRouter.get('/:testId', async (req, res, next) => {
	const selectedTest = await Test.getTestById(req.params.testId);
	res.send(selectedTest);
});

/**
 * Updates all the information of the specified test
 * @params req.params.testId Id of the required test
 * @return res The updated test
 */
testRouter.patch('/:testId', (req, res, next) => {});

/**
 * Deletes all the information of the specified test
 * @params req.params.testId Id of the required test
 */
testRouter.delete('/:testId', async (req, res, next) => {
	await Test.deleteTestById(req.params.testId);
	res.sendStatus(204);
});

/* ------------------------------------------           ROUTES FOR GAMES               ----------------------------------------------- */

// Endpoint for creating a new game
gameRouter.post('/', async (req, res, next) => {
	const newGame = req.body;
	const createdGame = await Test.createNewGame(newGame);
	res.send(createdGame);
});

/**
 * Sends an array of all the games
 * @return res Array of all game titles and IDs
 */
gameRouter.get('/all', async (req, res, next) => {
	const allGames = await Test.getAllGames();
	res.send(allGames);
});

/**
 * Sends all the information of the specified game
 * @params req.params.gameId Id of the required game
 * @return res Game with the specified Id with its players and responses
 */
gameRouter.get('/:gameId', async (req, res, next) => {
	const selectedGame = await Test.getGameById(req.params.gameId);
	res.send(selectedGame);
});

/**
 * Deletes all the information of the specified game
 * @params req.params.gameId Id of the required game
 */
gameRouter.delete('/:gameId', async (req, res, next) => {
	await Test.deleteGameById(req.params.gameId);
	res.sendStatus(204);
});

// Endpoint for creating a Player for specified test instance
gameRouter.post('/:gameId/join', async (req, res, next) => {
	const playerName = req.body.name;
	const { gameId } = req.params;
	const createdPlayer = await Test.createPlayer(playerName, gameId);
	req.session.playerId = createdPlayer.id;
	req.session.is_player = true;
	res.sendStatus(204);
});

// Endpoint for starting specified Game
gameRouter.post('/:gameId/start', async (req, res, next) => {
	const gameStarted = await Test.startGame(req.params.gameId);
	res.sendStatus(204);
});

// Endpoint for creating a Response for specified Game
gameRouter.post('/:gameId/answer', async (req, res, next) => {
	const { gameId } = req.params;
	const { answerId } = req.body;
	const { playerId } = req.session;
	const createdResponse = await Test.createResponse(answerId, gameId, playerId);
	res.sendStatus(204);
});

// Endpoint for ending specified Game
gameRouter.post('/:gameId/end', async (req, res, next) => {
	const gameEnded = await Test.endGame(req.params.gameId);
	res.sendStatus(204);
});

// Endpoint for moving to the next question in specified Game
gameRouter.post('/:gameId/next-question', async (req, res, next) => {
	const { gameId } = req.params;
	const nextQuestionObtained = await Test.nextQuestion(gameId);
	// res.send(nextQuestionObtained);
	if (nextQuestionObtained === null) {
		res.send(404);
	} else { res.sendStatus(204); }
});

/* ------------------------------------------    ROUTES FOR AUTH    ----------------------------------------------- */

authRouter.post('/admin-login', async (req, res) => {
	const { password } = req.body;
	const settings = await getSettings();
	if (settings.adminPassword !== password) {
		res.sendStatus(401);
		return;
	}
	req.session.isAdmin = true;

	res.sendStatus(204);
});

app.use('/test', testRouter);
app.use('/game', gameRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
