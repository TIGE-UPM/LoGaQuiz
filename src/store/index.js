import { configureStore } from '@reduxjs/toolkit';

import testReducer from './test';
import authReducer from './auth';

export default configureStore({
	reducer: {
		tests: testReducer,
		auth: authReducer,
	},
});
