const express = require('express');

const { getSettings } = require('../settings');

/* ------------------------------------------    ROUTES FOR AUTH    ----------------------------------------------- */

const authRouter = express.Router();

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

authRouter.get('/', async (req, res) => {
	res.send({
		isAdmin: !!req.session.isAdmin,
		isPlayer: !!req.session.isPlayer,
	});
});

module.exports = {
	router: authRouter,
};
