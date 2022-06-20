/* --------------------------------------           ROUTER UTILS            ----------------------------------------- */

async function userIsAdmin(req, res, next) {
	if (req.session.isAdmin) {
		return next();
	}
	return next(new Error('You are not an admin'));
}

async function userIsPlayer(req, res, next) {
	if (req.session.isPlayer) {
		return next();
	}
	return next(new Error('You are not an admin'));
}

module.exports = {
	userIsAdmin,
	userIsPlayer,
};
