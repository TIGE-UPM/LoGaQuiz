const express = require('express');

const { HOST_IP, PORT, SSID, PASSWORD } = process.env;

/* ------------------------------------------    ROUTES FOR AUTH    ----------------------------------------------- */

const router = express.Router();

router.post('/settings', async (req, res) => {
	res.send({
		hostIP: HOST_IP,
		port: PORT,
		ssid: SSID,
		password: PASSWORD,
	});
});

module.exports = {
	router,
};
