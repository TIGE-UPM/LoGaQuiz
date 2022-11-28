import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import Events from '../events';

const initialState = {
	isAdmin: false,
	isPlayer: false,
};

const fetchAuthData = createAsyncThunk('auth/fetchAuthData', async () => {
	const response = await axios.get('/api/auth');
	return response.data;
});

function loginAdmin(password) {
	return async function (dispatch) {
		const response = await axios.post('/api/auth/admin-login', { password });
		console.log(response);
		Events.reconnect();
		dispatch({ type: 'auth/userChanged', payload: response.data });
	};
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		userChanged: (state, action) => ({
			...state,
			...action.payload,
		}),
	},
	extraReducers(builder) {
		builder.addCase(fetchAuthData.fulfilled, (state, action) => action.payload);
	},
});

export const isAdmin = (state) => state.auth.isAdmin;
export const isPlayer = (state) => state.auth.isPlayer;

export { fetchAuthData, loginAdmin };

export default authSlice.reducer;
