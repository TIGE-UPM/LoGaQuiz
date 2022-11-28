import React from 'react';
import PropTypes from 'prop-types';

import './Podium.scss';

function PodiumPlace({ player, position, nTotalPlayers }) {
	const podiumClassNames = ['first', 'second', 'third'];
	const podiumClassName = podiumClassNames[position];

	return <div className={`podium-place-container flex column justify-end gap-1 col-fix-3 ${podiumClassName}`}>
		<div className='name flex center font-10 font-white'>{player?.name}</div>
		<div className='podium-place flex column gap-1'>
			<div className='flex center font-20 bg-white br-1 m-1 px-1'>
				{parseInt(position, 10) + 1}
			</div>
			{player ? (
				<>
					<div className='flex column center font-7'>
						<span>{Math.floor(player.currentScore)} pt</span>
					</div>
					<div className='flex center font-5'>
						{parseInt(position, 10) + 1} / {nTotalPlayers}
					</div>
				</>
			) : null}
		</div>
	</div>;
}

PodiumPlace.propTypes = {
	player: PropTypes.object,
	position: PropTypes.number,
	nTotalPlayers: PropTypes.number,
};

function Podium({ game }) {
	if (!game) {
		return null;
	}

	console.log(game);

	const orderedPlayers = game.players.sort((a, b) => b.currentScore - a.currentScore);

	return (
		<div className='flex column h-100 justify-space-between'>
			<div className='flex center pt-5 font-25 font-bold font-white'>
				Test: {game.playedTest.title}
			</div>
			<div className='align-self-center flex row'>
				<PodiumPlace player={orderedPlayers[1]} position={1} nTotalPlayers={orderedPlayers.length}></PodiumPlace>
				<PodiumPlace player={orderedPlayers[0]} position={0} nTotalPlayers={orderedPlayers.length}></PodiumPlace>
				<PodiumPlace player={orderedPlayers[2]} position={2} nTotalPlayers={orderedPlayers.length}></PodiumPlace>
			</div>
		</div>
	);
}

Podium.propTypes = {
	game: PropTypes.object.isRequired,
};

export default Podium;
