const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store);

const Api = require('./api');

const app = express();
const port = 3000;

const db = require('./db');

app.use(cookieParser());
app.use(express.json());

app.use(expressSession({
	secret: 'keep it secret, keep it safe.',
	store: new SessionStore({ db }),
}));

app.use('/api', Api);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
