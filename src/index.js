import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';

import '@Styles/global.scss';
import '@Styles/reset.scss';
import '@Styles/utils/index.scss';

import store from './store';
import { fetchAuthData } from './store/auth';

import Events from './events';

import Admin from './Admin';
import Public from './Public';

async function main() {
	await store.dispatch(fetchAuthData());
	await Events.init();
	const root = ReactDOM.createRoot(document.getElementById('root'));
	root.render(
		<React.StrictMode>
			<Provider store={store}>
				<BrowserRouter>
					<Routes>
						<Route path="/admin" element={<Admin.Main />}>
							<Route index element={<Admin.Tests />} />
							<Route path="tests" element={<Outlet />} >
								<Route index element={<Admin.Tests />} />
								<Route path="new" element={<Admin.TestEditor />} />
								<Route path=":testId" element={<Admin.TestEditor />} />
							</Route>
							<Route path="reports" element={<Outlet />} >
								<Route index element={<Admin.Reports />} />
								<Route path=":gameId" element={<Admin.Reports />} />
							</Route>

							<Route path="game/:gameId" element={<Admin.Game />} />

						</Route>
						<Route path="/" element={<Public.Main />}>
							<Route index element={<Public.Home />} />
							<Route path="tests" element={<Outlet />} >
								<Route index element={<Public.Tests />} />
								<Route path="new" element={<Public.TestEditor />} />
								<Route path=":testId" element={<Public.TestEditor />} />
							</Route>
							<Route path="reports" element={<Public.Reports />} />
							<Route path="game/:gameId" element={<Public.Game />} />

						</Route>
					</Routes>
				</BrowserRouter>
			</Provider>
		</React.StrictMode>
	);
}
main();
