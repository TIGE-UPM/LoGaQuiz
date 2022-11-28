import React from 'react';
import { NavLink } from 'react-router-dom';

import './Menu.scss';

function Menu() {
	return (
		<div className='menu-container'>
			<NavLink to={'/admin/tests'} className="link">
				Tests
			</NavLink>
			<NavLink to={'/admin/report'} className="link">
				Reports
			</NavLink>
		</div>
	);
}

export default Menu;
