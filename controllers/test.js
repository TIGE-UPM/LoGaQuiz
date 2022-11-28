const express = require('express');

const TestUtils = require('../db/test');

const { userIsAdmin } = require('../utils/router');

/* --------------------------------------          ROUTES FOR TEST           ----------------------------------------- */

const router = express.Router();

/**
 * Creates a test with the information sent in the request body
 * @param req.body The test information, containing its questions and its answers
 * @return res The created test
 */
router.post('/', userIsAdmin, async (req, res, next) => {
	const { test } = req.body;
	const createdTest = await TestUtils.createNewTest(test);
	console.log(createdTest);
	res.send(createdTest);
});

/**
 * Updates all the information of the specified test
 * @params req.params.testId Id of the required test
 * @return res The updated test
 */
router.patch('/:testId', userIsAdmin, async (req, res, next) => {
	const test = await TestUtils.updateTest(req.params.testId, req.body);
	res.send(test);
});

/**
 * Sends an array of all the tests
 * @return res Array of all test titles and IDs
 */
router.get('/all', userIsAdmin, async (req, res, next) => {
	console.log(TestUtils);
	const allTests = await TestUtils.getAllTests();
	res.send(allTests);
});

/**
 * Sends all the information of the specified test
 * @params req.params.testId Id of the required test
 * @return res Test with the specified Id with its questions and anwers
 */
router.get('/:testId', userIsAdmin, async (req, res, next) => {
	const selectedTest = await TestUtils.getTestById(req.params.testId);
	console.log(selectedTest);
	res.send(selectedTest);
});

/**
 * Deletes all the information of the specified test
 * @params req.params.testId Id of the required test
 */
router.delete('/:testId', userIsAdmin, async (req, res, next) => {
	await TestUtils.deleteTestById(req.params.testId);
	res.sendStatus(204);
});

module.exports = {
	router,
};
