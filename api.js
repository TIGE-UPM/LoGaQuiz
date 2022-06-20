const express = require('express');

const GameController = require('./controllers/game');
const TestController = require('./controllers/test');
const AuthController = require('./controllers/auth');

const apiRouter = express.Router();

apiRouter.use('/game', GameController.router);
apiRouter.use('/test', TestController.router);
apiRouter.use('/auth', AuthController.router);

module.exports = apiRouter;
