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
const testInstanceRouter = express.Router();
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
	const fulltest = req.body;
});

/**
 * Sends an array of all the tests
 * @return res Array of all test titles and IDs
 */
testRouter.get('/all', async (req, res, next) => {
	console.log('Estoy en el router');
	const alltests = await Test.getAllTests();
	res.send(alltests);
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
	const testID = req.params.testId;
	await Test.deleteTestById(testID);
	res.sendStatus(204);
});

/* ------------------------------------------    ROUTES FOR TESTINSTANCE    ----------------------------------------------- */

// Endpoint for creating a new test instance
testInstanceRouter.post('/', (req, res, next) => {});

// Endpoint for receiving all test instances
testInstanceRouter.get('/all', (req, res, next) => {});

// Endpoint for receiving specified test instance
testInstanceRouter.get('/:testInstanceId', (req, res, next) => {});

// Endpoint for deleting specified test instance
testInstanceRouter.delete('/:testInstanceId', (req, res, next) => {});

// Endpoint for creating a playerInstance for specified test instance
testInstanceRouter.post('/:testInstanceId/join', (req, res, next) => {});

// Endpoint for starting specified test instance
testInstanceRouter.post('/:testInstanceId/start', (req, res, next) => {});

// Endpoint for creating a answerInstance for specified test instance
testInstanceRouter.post('/:testInstanceId/answer', (req, res, next) => {});

// Endpoint for ending specified test instance
testInstanceRouter.post('/:testInstanceId/end', (req, res, next) => {});

// Endpoint for moving to the next question in specified test instance
testInstanceRouter.post('/:testInstanceId/next-question', (req, res, next) => {});

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
app.use('/test-instance', testInstanceRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
