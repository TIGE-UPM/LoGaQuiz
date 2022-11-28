const socketio = require('../socketio');

let namespace;

module.exports.init = () => {
	namespace = socketio.getNamespace('/events');
	namespace.on('connection', (socket) => {
		console.log('hola');
		console.log(socket.request?.session);
		if (socket.request.session?.isAdmin) {
			console.log('admin');
			socket.join('admin');
		}
		if (socket.request.session?.games) {
			for (const gameId in socket?.request?.session.games) {
				const playerId = socket?.request?.session.games[gameId];
				console.log(`game:${gameId}`);
				socket.join(`game:${gameId}`);
				socket.join(`player:${playerId}`);
			}
		}
	});
};

module.exports.emitToPlayer = (playerId, event, ...args) => {
	console.log(playerId, event);
	namespace.in(`player:${playerId}`).emit(event, ...args);
};

module.exports.emitToGame = (gameId, event, ...args) => {
	console.log(gameId, event);
	namespace.in(`game:${gameId}`).emit(event, ...args);
};

module.exports.emitToAdmin = (gameId, event, ...args) => {
	console.log(gameId, event);
	namespace.in('admin').emit(event, ...args);
};
