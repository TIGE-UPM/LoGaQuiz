const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite:./db/LoGaQuizTest.db');

// (async () => {
// 	await sequelize.sync({ alter: true });
// })();

// (async () => {
// 	await sequelize.sync({ force: true });
// })();

module.exports = sequelize;
