const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite:./db/LoGaQuiz.db');

// (async () => {
// 	await sequelize.sync({ alter: true });
// })();
module.exports = sequelize;
