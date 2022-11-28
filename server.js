const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store);
const socketio = require('./socketio');

const Api = require('./api');
const { handleErrors } = require('./errors');
const Events = require('./utils/events');

const app = express();
const { PORT = 4000 } = process.env;

const db = require('./db');

app.use(cookieParser());
app.use(express.json());

app.use(expressSession({
	secret: 'keep it secret, keep it safe.',
	store: new SessionStore({ db }),
}));

app.use('/api', Api);

app.use(express.static('build'));

app.use((req, res) => {
	res.sendFile(path.join(__dirname, './build/index.html'));
});

handleErrors(app);

const httpServer = http.createServer(app);
socketio.init(httpServer);

Events.init();

httpServer.listen(PORT, '0.0.0.0', () => {
	console.log(`App listening on port ${PORT}`);
});
