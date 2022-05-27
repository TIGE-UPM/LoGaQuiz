const { DataTypes } = require('sequelize');
const sequelize = require('./index');

/**
 * Create the Model for the Tests database
 */
const Test = sequelize.define(
	'Test',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: true,
	}
);

/**
 * Create the Model for the Questions database
 */
const Question = sequelize.define(
	'Question',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		question_type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		allocated_time: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		question_order: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		weight: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

/**
 * Create the Model for the Answers database
 */
const Answer = sequelize.define(
	'Answer',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		is_correct: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

// ------------------------------------------------------------------------

/**
 * Create the Model for the PlayedTests database
 */
const PlayedTest = sequelize.define(
	'PlayedTest',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: true,
	}
);

/**
 * Create the Model for the PlayedQuestions database
 */
const PlayedQuestion = sequelize.define(
	'PlayedQuestion',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		question_type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		allocated_time: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		question_order: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		weight: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

/**
 * Create the Model for the PlayedAnswers database
 */
const PlayedAnswer = sequelize.define(
	'PlayedAnswer',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		is_correct: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

//--------------------------------------------------------------------------

/**
 * Create the Model for the Games database
 */
const Game = sequelize.define(
	'Game',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		played_at: {
			type: DataTypes.DATE,
		},
		current_question: {
			type: DataTypes.INTEGER,
		},
		finished: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

/**
 * Create the Model for the Players database
 */
const Player = sequelize.define(
	'Player',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ranking: {
			type: DataTypes.INTEGER,
		},
		current_score: {
			type: DataTypes.INTEGER,
		},
	},
	{
		timestamps: true,
	}
);

/**
 * Create the Model for the Responses database
 */
const Response = sequelize.define(
	'Response',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		answer_time: {
			type: DataTypes.REAL,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);
/* ---------------------------------------- DATABASE RELATIONS   ----------------------------------------------------*/

// Relations between Tests, Questions and Answers

// Relation between Tests and Questions 1:N
Test.hasMany(Question, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'test_id',
});
Question.belongsTo(Test, {
	allowNull: false,
	foreignKey: 'test_id',
});

// Relation between Questions and Answers 1:N
Question.hasMany(Answer, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'question_id',
});
Answer.belongsTo(Question, {
	allowNull: false,
	foreignKey: 'question_id',
});

// Relations between PlayedTests (& Tests & Games), Played Questions and PlayedAnswers

// Relation PlayedTests and Tests 1:N
Test.hasMany(PlayedTest, {
	onDelete: 'NO ACTION',
	onUpdate: 'NO ACTION',
	foreignKey: 'test_id',
});
PlayedTest.belongsTo(Test, {
	allowNull: false,
	foreignKey: 'test_id',
});

// Relation PlayedTests and Games 1:1
Game.hasOne(PlayedTest, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'game_id',
});
PlayedTest.belongsTo(Game, {
	allowNull: false,
	foreignKey: 'game_id',
});

// Relation between PlayedTests and PlayedQuestions 1:N
PlayedTest.hasMany(PlayedQuestion, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'played_test_id',
});
PlayedQuestion.belongsTo(PlayedTest, {
	allowNull: false,
	foreignKey: 'played_test_id',
});

// Relation between PlayedQuestions and PlayedAnswers 1:N
PlayedQuestion.hasMany(PlayedAnswer, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'played_question_id',
});
PlayedAnswer.belongsTo(PlayedQuestion, {
	allowNull: false,
	foreignKey: 'played_question_id',
});

// Relations between Games, Players and Responses ------------------------------------------

// Relation between Games and Players 1:N
Game.hasMany(Player, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'game_id',
});
Player.belongsTo(Game, {
	allowNull: false,
	foreignKey: 'game_id',
});

// Relation between Responses and Games 1:N
Game.hasMany(Response, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'game_id',
});
Response.belongsTo(Game, {
	allowNull: false,
	foreignKey: 'game_id',
});

// Relation between Responses and Players 1:N
Player.hasMany(Response, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'player_id',
});
Response.belongsTo(Player, {
	allowNull: false,
	foreignKey: 'player_id',
});

// Relation between Responses and PlayedQuestions 1:N
PlayedQuestion.hasMany(Response, {
	onDelete: 'NO ACTION',
	onUpdate: 'NO ACTION',
	foreignKey: 'played_question_id',
});
Response.belongsTo(PlayedQuestion, {
	foreignKey: 'played_question_id',
});

// Relation between Responses and PlayedAnswers 1:N
PlayedAnswer.hasMany(Response, {
	onDelete: 'NO ACTION',
	onUpdate: 'NO ACTION',
	foreignKey: 'played_answer_id',
});
Response.belongsTo(PlayedAnswer, {
	foreignKey: 'played_answer_id',
});

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
	const selectedTest = await Test.findAll({
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
	console.log(selectedTest);
	if (!selectedTest) {
		console.log("There isn't a test with that ID");
		return null;
	}

	return selectedTest;
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
	const selectedGame = await Game.findAll({
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
	console.log(selectedGame);
	if (!selectedGame) {
		console.log("There isn't a test with that ID");
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

module.exports = { getAllTests, getTestById, deleteTestById, getAllGames, getGameById, deleteGameById };
