/* eslint-disable no-undef */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://localhost:4000',
			changeOrigin: true,
		})
	);

	app.use(
		createProxyMiddleware('/socket.io', {
			target: 'http://localhost:4000',
			ws: true,
		})
	);
};