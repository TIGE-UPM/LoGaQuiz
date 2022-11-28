import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const createTest = async (test) => {
	const response = await axios.post('/api/test/', { test });
	return response.data;
};

const updateTest = async (testId, test) => {
	const response = await axios.patch(`/api/test/${testId}`, test);
	return response.data;
};

const getTestById = async (testId) => {
	const response = await axios.get(`/api/test/${testId}`);
	return response.data;
};

const getAllTests = async () => {
	const response = await axios.get('/api/test/all');
	return response.data;
};

export const testSlice = createSlice({
	name: 'test',
	initialState: {
		tests: [],
		status: 'idle',
		error: null,
	},
	reducers: {
	},
});

export { getAllTests, getTestById, createTest, updateTest };

export default testSlice.reducer;
