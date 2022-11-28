import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAsync } from 'react-use';
import QRCode from 'react-qr-code';

import Components from '@Components';

import './WaitingRoom.scss';

import * as Game from '../../../store/game';
import Wifi from '../../../store/wifi';

const { ButtonLink } = Components;

function WaitingRoom({ game }) {
	const [settings, setSettings] = useState({});
	useAsync(async () => {
		setSettings(await Wifi.getSettings());
	}, []);

	if (!game) {
		return null;
	}

	async function onStartClick() {
		await Game.startGame(game.id);
	}

	let playersPills;
	if (game?.players?.length) {
		playersPills = game.players.map((player) => (
			<div key={player.id} className='bg-grey-back py-1 px-2 br-4 font-3 shadow-2'>{player.name}</div>
		));
	} else {
		playersPills = <div>Todavía no hay jugadores</div>;
	}

	return (
		<div className='flex column w-100'>
			<div className='flex row align-items-center justify-space-between p-2 px-5'>
				<div className='flex column center font-8 font-white'>
					{/* <img src="/qr.webp" className='col-fix-2' alt="" /> */}
					<QRCode
						className="col-fix-2"
						value={`WIFI:T:WPA;S:${settings.ssid};P:${settings.password};H:flase;`}
					/>
					<span className='font-white font-bold mt-2'>Wi-Fi</span>
					<span>{settings.ssid}</span>
					<span>{settings.password}</span>
				</div>
				<div className='flex column align-items-center font-white gap-4'>
					<span className='font-15 font-bold'>{`${game?.id}`.match(/.{1,3}/g).join(' ')}</span>
					<ButtonLink style="button" onClick={onStartClick}>Empezar</ButtonLink>
				</div>
				<div className='flex column center font-8 font-white'>
					{/* <img src="/qr.webp" className='col-fix-2' alt="" /> */}
					<QRCode
						className="col-fix-2"
						value={`http://${settings.hostIP}:${settings?.port}`}
					/>
					<span className='font-white font-bold mt-2'>Web</span>
					<span>{`http://${settings.hostIP}:${settings?.port}`}</span>
				</div>
			</div>
			<div className='flex column align-items-center gap-5'>
				<div className='font-10 font-bold font-white'>Número de jugadores: {game?.players?.length ?? 0}</div>
				<div className='flex row gap-2'>
					{playersPills}
				</div>
			</div>
		</div>
	);
}

WaitingRoom.propTypes = {
	game: PropTypes.object.isRequired,
};

export default WaitingRoom;
