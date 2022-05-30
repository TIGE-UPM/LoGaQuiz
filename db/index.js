const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite:./db/Populated.db');

// (async () => {
// 	await sequelize.sync({ force: true });
// })();

module.exports = sequelize;
