import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const newGame = async (testId) => {
	const response = await axios.post('/api/game/', { testId });
	return response.data;
};

const getGame = async (gameId) => {
	const response = await axios.get(`/api/game/${gameId}`);
	return response.data;
};

const getAllGames = async () => {
	const response = await axios.get('/api/game/all');
	return response.data;
};

const getGameStatus = async (gameId) => {
	const response = await axios.get(`/api/game/${gameId}/status`);
	return response.data;
};

const joinGame = async (gameId, playerName) => {
	const response = await axios.post(`/api/game/${gameId}/join`, { playerName });
	return response.data;
};

const startGame = async (gameId) => {
	const response = await axios.post(`/api/game/${gameId}/start`);
	return response.data;
};

const nextQuestion = async (gameId) => {
	const response = await axios.post(`/api/game/${gameId}/next-question`);
	return response.data;
};

const answerQuestion = async (gameId, answerId) => {
	const response = await axios.post(`/api/game/${gameId}/answer/`, { answerId });
	return response.data;
};

const getQuestionIsCorrect = async (gameId, questionId) => {
	const response = await axios.get(`/api/game/${gameId}/question/${questionId}/is-correct`);
	return response.data;
};

const getPlayerPosition = async (gameId) => {
	const response = await axios.get(`/api/game/${gameId}/position`);
	return response.data.position;
};

export const gameSlice = createSlice({
	name: 'game',
	initialState: {
		tests: [],
		status: 'idle',
		error: null,
	},
	reducers: {
	},
});

export { newGame, getGame, getAllGames, getGameStatus, joinGame, startGame, nextQuestion, answerQuestion, getQuestionIsCorrect, getPlayerPosition };

export default gameSlice.reducer;
