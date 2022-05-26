const express = require("express");
const app = express();
const port = 3000;
const Test = require("./db/test.js");

const testRouter = express.Router();
const testInstanceRouter = express.Router();

app.use(express.json());

/* --------------------------------------          ROUTES FOR TEST           ----------------------------------------- */

/**
 * Creates a test with the information sent in the request body
 * @param req.body The test information, containing its questions and its answers
 * @return res The created test
 */
testRouter.post("/", (req, res, next) => {
	let fulltest = req.body;
});

/**
 * Sends an array of all the tests
 * @return res Array of all test titles and IDs
 */
testRouter.get("/all", async (req, res, next) => {
	console.log("Estoy en el router");
	let alltests = await Test.getAllTests();
	res.send(alltests);
});

/**
 * Sends all the information of the specified test
 * @params req.params.testId ID of the required test
 * @return res Test with the specified ID with its questions and anwers
 */
testRouter.get("/:testId", async (req, res, next) => {
	let testID = req.params.testId;
	let selectedTest = await Test.getTestById(testID);
	res.send(selectedTest);
});

/**
 * Updates all the information of the specified test
 * @params req.params.testId ID of the required test
 * @return res The updated test
 */
testRouter.patch("/:testId", (req, res, next) => {});

/**
 * Deletes all the information of the specified test
 * @params req.params.testId ID of the required test
 */
testRouter.delete("/:testId", async (req, res, next) => {
	let testID = req.params.testId;
	await Test.deleteTestById(testID);
	res.sendStatus(204);
});

/* ------------------------------------------    ROUTES FOT TESTINSTANCE    ----------------------------------------------- */

// Endpoint for creating a new test instance
testInstanceRouter.post("/", (req, res, next) => {});

// Endpoint for receiving all test instances
testInstanceRouter.get("/all", (req, res, next) => {});

// Endpoint for receiving specified test instance
testInstanceRouter.get("/:testInstanceId", (req, res, next) => {});

// Endpoint for deleting specified test instance
testInstanceRouter.delete("/:testInstanceId", (req, res, next) => {});

// Endpoint for creating a playerInstance for specified test instance
testInstanceRouter.post("/:testInstanceId/join", (req, res, next) => {});

// Endpoint for starting specified test instance
testInstanceRouter.post("/:testInstanceId/start", (req, res, next) => {});

// Endpoint for creating a answerInstance for specified test instance
testInstanceRouter.post("/:testInstanceId/answer", (req, res, next) => {});

// Endpoint for ending specified test instance
testInstanceRouter.post("/:testInstanceId/end", (req, res, next) => {});

// Endpoint for moving to the next question in specified test instance
testInstanceRouter.post(
	"/:testInstanceId/next-question",
	(req, res, next) => {}
);

app.use("/test", testRouter);
app.use("test-instance", testInstanceRouter);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
