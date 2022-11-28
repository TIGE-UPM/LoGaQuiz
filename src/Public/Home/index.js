import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Components from '@Components';
import Form from '@Components/Form';
import Logo from '../../assets/logaquiz.png';
import * as Game from '../../store/game';
import Events from '../../events';

import './Home.scss';

const { ButtonLink } = Components;
const { TextInput } = Form;

function Home() {
	const [gameId, setGameId] = useState('');
	const [playerName, setPlayerName] = useState('');

	const navigate = useNavigate();

	async function onSubmit() {
		console.log(await Game.joinGame(gameId, playerName));
		await Events.reconnect();

		navigate(`/game/${gameId}`);
	}
	return (
		<div className='flex row justify-center p-2'>
			<div className='flex column gap-2 align-items-center mt-5'>
				<img src={Logo} alt='logo' className='logo' />
				<span className='font-8 font-white mt-2'>Únete a un juego</span>
				<TextInput type='number' value={gameId} onChange={(e) => setGameId(e.target.value)} placeholder='Introduce el id del juego...' />
				<TextInput type='text' value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder='Introduce tu nombre...' />
				<ButtonLink style="button" onClick={onSubmit}>Unirme</ButtonLink>
			</div>
		</div>
	);
}

export default Home;
