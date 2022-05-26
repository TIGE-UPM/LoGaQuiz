const res = require("express/lib/response");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index.js");
const sqlite3 = require("sqlite3").verbose();

/**
 * Create the Model for the Tests database
 */
const Test = sequelize.define(
	"Test",
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
	"Question",
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

// Relation between Tests and Questions
Test.hasMany(Question, {
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
	foreignKey: "test_id",
});
Question.belongsTo(Test, {
	allowNull: false,
	foreignKey: "test_id",
});

/**
 * Create the Model for the Answers database
 */
const Answer = sequelize.define(
	"Answer",
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

// Relation between Questions and Answers
Question.hasMany(Answer, {
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
	foreignKey: "question_id",
});
Answer.belongsTo(Question, {
	allowNull: false,
	foreignKey: "question_id",
});

/**
 * Create the Model for the TestInstances database
 */
const TestInstance = sequelize.define(
	"TestInstance",
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

// Relation between Tests and TestInstances
Test.hasMany(TestInstance, {
	onDelete: "NO ACTION",
	onUpdate: "NO ACTION",
	foreignKey: "test_id",
});
TestInstance.belongsTo(Test, {
	foreignKey: "test_id",
});

/**
 * Create the Model for the PlayerInstances database
 */
const PlayerInstance = sequelize.define(
	"PlayerInstance",
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

// Relation between TestInstances and PlayerInstances
TestInstance.hasMany(PlayerInstance, {
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
	foreignKey: "test_instance_id",
});
PlayerInstance.belongsTo(TestInstance, {
	allowNull: false,
	foreignKey: "test_instance_id",
});

/**
 * Create the Model for the AnswerInstances database
 */
const AnswerInstance = sequelize.define(
	"AnswerInstance",
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

// Relation between AnswerInstances and TestInstances
TestInstance.hasMany(AnswerInstance, {
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
	foreignKey: "test_instance_id",
});
AnswerInstance.belongsTo(TestInstance, {
	allowNull: false,
	foreignKey: "test_instance_id",
});

// Relation between AnswerInstances and PlayerInstances
PlayerInstance.hasMany(AnswerInstance, {
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
	foreignKey: "player_instance_id",
});
AnswerInstance.belongsTo(PlayerInstance, {
	allowNull: false,
	foreignKey: "player_instance_id",
});

// Relation between AnswerInstances and Questions
Question.hasMany(AnswerInstance, {
	onDelete: "NO ACTION",
	onUpdate: "NO ACTION",
	foreignKey: "question_id",
});
AnswerInstance.belongsTo(Question, {
	foreignKey: "question_id",
});

// Relation between AnswerInstances and Answers
Answer.hasMany(AnswerInstance, {
	onDelete: "NO ACTION",
	onUpdate: "NO ACTION",
	foreignKey: "answer_id",
});
AnswerInstance.belongsTo(Answer, {
	foreignKey: "answer_id",
});

/**
 * Function that returns an array with the id, title and image of all tests
 * @returns Test array
 */
async function getAllTests() {
	const allTests = await Test.findAll({
		attributes: ["id", "title", "image"],
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
		order: [[Question, "question_order", "ASC"]],
	});
	console.log(selectedTest);
	if (selectedTest == null) {
		console.log("There isn't a test with that ID");
	} else {
		return selectedTest;
	}
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
	return;
}

module.exports = { getAllTests, getTestById, deleteTestById };
