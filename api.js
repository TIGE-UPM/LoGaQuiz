const express = require('express');

const { CustomError } = require('./errors');

const GameController = require('./controllers/game');
const TestController = require('./controllers/test');
const AuthController = require('./controllers/auth');
const WifiController = require('./controllers/wifi');

const apiRouter = express.Router();

apiRouter.use('/game', GameController.router);
apiRouter.use('/test', TestController.router);
apiRouter.use('/auth', AuthController.router);
apiRouter.use('/wifi', WifiController.router);
apiRouter.use(() => {
	throw new CustomError('Route Not Found', 'route_not_found', 404);
});

module.exports = apiRouter;
