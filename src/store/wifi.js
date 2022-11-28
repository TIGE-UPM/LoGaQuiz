import axios from 'axios';

async function getSettings() {
	return axios.get('/api/wifi/settings');
}

export default getSettings;
