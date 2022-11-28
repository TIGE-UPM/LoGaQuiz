const { DataTypes, Op } = require('sequelize');
const sequelize = require('./index');

/**
 * Create the Model for the Tests database
 */
const Test = sequelize.define(
	'test',
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
	}
);

/**
 * Create the Model for the Questions database
 */
const Question = sequelize.define(
	'question',
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
		questionType: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		allocatedTime: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		questionOrder: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		weight: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}
);

/**
 * Create the Model for the Answers database
 */
const Answer = sequelize.define(
	'answer',
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
		isCorrect: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	}
);

// ------------------------------------------------------------------------

/**
 * Create the Model for the PlayedTests database
 */
const PlayedTest = sequelize.define(
	'playedTest',
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
	}
);

/**
 * Create the Model for the PlayedQuestions database
 */
const PlayedQuestion = sequelize.define(
	'playedQuestion',
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
		questionType: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		allocatedTime: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		questionOrder: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		weight: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		startTime: {
			type: DataTypes.DATE,
		},
	}
);

/**
 * Create the Model for the PlayedAnswers database
 */
const PlayedAnswer = sequelize.define(
	'playedAnswer',
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
		isCorrect: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	}
);

//--------------------------------------------------------------------------

/**
 * Create the Model for the Games database
 */
const Game = sequelize.define(
	'game',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		startTime: {
			type: DataTypes.DATE(3),
		},
		status: {
			type: DataTypes.ENUM,
			values: ['IDLE', 'PLAYING', 'FINISHED'],
			defaultValue: 'IDLE',
		},
	}
);
// (async () => {
// 	await Game.sync({ alter: true });
// })();

/**
 * Create the Model for the Players database
 */
const Player = sequelize.define(
	'player',
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
		currentScore: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	}
);

/**
 * Create the Model for the Responses database
 */
const Response = sequelize.define(
	'response',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		answerTime: {
			type: DataTypes.REAL,
			allowNull: false,
		},
		score: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['playerId', 'playedQuestionId'],
			},
		],
	}
);
/* ---------------------------------------- DATABASE RELATIONS   ----------------------------------------------------*/

// Relations between Tests, Questions and Answers

// Relation between Tests and Questions 1:N
Test.hasMany(Question, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'testId',
});
Question.belongsTo(Test, {
	allowNull: false,
	foreignKey: 'testId',
});

// Relation between Questions and Answers 1:N
Question.hasMany(Answer, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'questionId',
});
Answer.belongsTo(Question, {
	allowNull: false,
	foreignKey: 'questionId',
});

// Relations between PlayedTests (& Tests & Games), Played Questions and PlayedAnswers

// Relation PlayedTests and Tests 1:N
Test.hasMany(PlayedTest, {
	onDelete: 'NO ACTION',
	onUpdate: 'NO ACTION',
	foreignKey: 'testId',
});
PlayedTest.belongsTo(Test, {
	allowNull: false,
	foreignKey: 'testId',
});

// Relation PlayedTests and Games 1:1
Game.hasOne(PlayedTest, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'gameId',
});
PlayedTest.belongsTo(Game, {
	allowNull: false,
	foreignKey: 'gameId',
});

// Relation PlayedQuestion and Games 1:1
PlayedQuestion.hasOne(Game, {
	allowNull: true,
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'currentQuestionId',
});
Game.belongsTo(PlayedQuestion, {
	allowNull: true,
	foreignKey: 'currentQuestionId',
	as: 'currentQuestion',
});

// Relation between PlayedTests and PlayedQuestions 1:N
PlayedTest.hasMany(PlayedQuestion, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'playedTestId',
});
PlayedQuestion.belongsTo(PlayedTest, {
	allowNull: false,
	foreignKey: 'playedTestId',
});

// Relation between PlayedQuestions and PlayedAnswers 1:N
PlayedQuestion.hasMany(PlayedAnswer, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'playedQuestionId',
});
PlayedAnswer.belongsTo(PlayedQuestion, {
	allowNull: false,
	foreignKey: 'playedQuestionId',
});

// Relations between Games, Players and Responses ------------------------------------------

// Relation between Games and Players 1:N
Game.hasMany(Player, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'gameId',
});
Player.belongsTo(Game, {
	allowNull: false,
	foreignKey: 'gameId',
});

// Relation between Responses and Games 1:N
Game.hasMany(Response, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'gameId',
});
Response.belongsTo(Game, {
	allowNull: false,
	foreignKey: 'gameId',
});

// Relation between Responses and Players 1:N
Player.hasMany(Response, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'playerId',
});
Response.belongsTo(Player, {
	allowNull: false,
	foreignKey: 'playerId',
});

// Relation between Responses and PlayedQuestions 1:N
PlayedQuestion.hasMany(Response, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'playedQuestionId',
});
Response.belongsTo(PlayedQuestion, {
	foreignKey: 'playedQuestionId',
});

// Relation between Responses and PlayedAnswers 1:N
PlayedAnswer.hasMany(Response, {
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
	foreignKey: 'playedAnswerId',
});
Response.belongsTo(PlayedAnswer, {
	foreignKey: 'playedAnswerId',
});

module.exports = {
	Test,
	Question,
	Answer,
	PlayedTest,
	PlayedQuestion,
	PlayedAnswer,
	Game,
	Player,
	Response,
};
