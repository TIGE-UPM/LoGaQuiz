const express = require('express');
const { Test } = require('../db/models');

const { userIsAdmin } = require('../utils/router');

/* --------------------------------------          ROUTES FOR TEST           ----------------------------------------- */

const testRouter = express.Router();

/**
 * Creates a test with the information sent in the request body
 * @param req.body The test information, containing its questions and its answers
 * @return res The created test
 */
testRouter.post('/', userIsAdmin, async (req, res, next) => {
	const newCompleteTest = req.body;
	const createdTest = await Test.createNewTest(newCompleteTest);
	res.send(createdTest);
});

/**
 * Sends an array of all the tests
 * @return res Array of all test titles and IDs
 */
testRouter.get('/all', userIsAdmin, async (req, res, next) => {
	const allTests = await Test.getAllTests();
	res.send(allTests);
});

/**
 * Sends all the information of the specified test
 * @params req.params.testId Id of the required test
 * @return res Test with the specified Id with its questions and anwers
 */
testRouter.get('/:testId', userIsAdmin, async (req, res, next) => {
	const selectedTest = await Test.getTestById(req.params.testId);
	res.send(selectedTest);
});

/**
 * Updates all the information of the specified test
 * @params req.params.testId Id of the required test
 * @return res The updated test
 */
testRouter.patch('/:testId', userIsAdmin, async (req, res, next) => {
	const test = await Test.updateTest(req.params.testId, req.body);
	res.send(test);
});

/**
 * Deletes all the information of the specified test
 * @params req.params.testId Id of the required test
 */
testRouter.delete('/:testId', userIsAdmin, async (req, res, next) => {
	await Test.deleteTestById(req.params.testId);
	res.sendStatus(204);
});

module.exports = {
	router: testRouter,
};
