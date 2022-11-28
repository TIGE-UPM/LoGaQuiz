const socketIO = require('socket.io');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store);

const db = require('./db');

let io;

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

module.exports.init = (httpServer) => {
	io = socketIO(httpServer);
};

module.exports.getNamespace = (namespaceName) => {
	if (!io) throw new Error('socket.io not initialized');

	const namespace = io.of(namespaceName);
	namespace.use(wrap(expressSession({
		secret: 'keep it secret, keep it safe.',
		store: new SessionStore({ db }),
	})));
	return namespace;
};
