import { io } from 'socket.io-client';

export default {
	async init() {
		this.socket = io('/events', { transports: ['websocket', 'polling'], autoConnect: true });
	},
	reconnect() {
		console.log('disconnect');
		this.socket.disconnect();
		console.log('disconnected');
		this.socket.connect();
	},
	addListener(event, listener) {
		console.log('listener', event);
		this.socket.on(event, listener);
	},
	removeListener(event, listener) {
		this.socket.off(event, listener);
	},
};
