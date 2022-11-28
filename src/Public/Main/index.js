import React from 'react';
import { Outlet } from 'react-router-dom';

import './Main.scss';

function Main() {
	return (
		<div className='main-container-public'>
			<Outlet />
		</div>
	);
}

export default Main;
