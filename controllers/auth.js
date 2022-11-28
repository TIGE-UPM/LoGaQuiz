const express = require('express');

const { getSettings } = require('../settings');

/* ------------------------------------------    ROUTES FOR AUTH    ----------------------------------------------- */

const router = express.Router();

router.post('/admin-login', async (req, res) => {
	const { password } = req.body;
	const settings = await getSettings();
	if (settings.adminPassword !== password) {
		res.sendStatus(401);
		return;
	}
	req.session.isAdmin = true;

	res.send({
		isAdmin: !!req.session.isAdmin,
		isPlayer: !!req.session.isPlayer,
	});
});

router.get('/', async (req, res) => {
	res.send({
		isAdmin: !!req.session.isAdmin,
		isPlayer: !!req.session.isPlayer,
	});
});

module.exports = {
	router,
};
