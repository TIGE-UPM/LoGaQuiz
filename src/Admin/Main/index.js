import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Form from '@Components/Form';
import Components from '@Components';
import * as Auth from '../../store/auth';

import './Main.scss';
import Menu from '../Menu';

const { ButtonLink } = Components;
const { TextInput } = Form;

function Main() {
	const isAdmin = useSelector(Auth.isAdmin);
	const dispatch = useDispatch();

	const [password, setPassword] = useState('');
	function onLoginClick() {
		dispatch(Auth.loginAdmin(password));
	}

	if (!isAdmin) {
		return (
			<div className='login-container flex row justify-center p-2'>
				<div className='flex column gap-2 align-items-center mt-5'>
					<span className='font-8 font-bold font-primary-hard'>Admin panel</span>
					<span className='font-8 font-bold font-primary-hard'>Log In</span>
					<TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter the password...' />
					<ButtonLink style="button" onClick={() => onLoginClick()}>Submit</ButtonLink>
				</div>
			</div>
		);
	}
	return (
		<div className='main-container h-100'>
			<Menu />
			<Outlet />
		</div>
	);
}

export default Main;
