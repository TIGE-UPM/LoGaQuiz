import React from 'react';

import Components from '@Components';

import './Menu.scss';

const { ButtonLink } = Components;

function Menu() {
	return (
		<div className='flex row gap-3 p-2 bg-grey-back'>
			<ButtonLink to={'/admin/tests'} className="link">
				Tests
			</ButtonLink>
			<ButtonLink to={'/admin/reports'} className="link">
				Reports
			</ButtonLink>
		</div>
	);
}

export default Menu;
