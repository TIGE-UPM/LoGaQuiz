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
testRouter.post('/', (req, res, next) => {
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

/* ------------------------------------------    ROUTES FOR TESTINSTANCE    ----------------------------------------------- */

// Endpoint for creating a new test instance
gameRouter.post('/', (req, res, next) => {});

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

// Endpoint for creating a playerInstance for specified test instance
gameRouter.post('/:gameId/join', (req, res, next) => {});

// Endpoint for starting specified test instance
gameRouter.post('/:gameId/start', (req, res, next) => {});

// Endpoint for creating a answerInstance for specified test instance
gameRouter.post('/:gameId/answer', (req, res, next) => {});

// Endpoint for ending specified test instance
gameRouter.post('/:gameId/end', (req, res, next) => {});

// Endpoint for moving to the next question in specified test instance
gameRouter.post('/:gameId/next-question', (req, res, next) => {});

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
