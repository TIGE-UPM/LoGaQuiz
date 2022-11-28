import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Components from '@Components';
import * as Game from '../../store/game';

import './Reports.css';

const { ButtonLink } = Components;

function GameList(props) {
	const { games } = props;

	if (!games?.length) {
		return (
			<p>There are no played games</p>
		);
	}

	const rows = games.map((game) => (
		<tr key={game.id}>
			<td>{game.id}</td>
			<td>{game.playedTest.title}</td>
			<td>{game.startTime}</td>
			<td>{game.status}</td>
			<td>{game.playedTest.playedQuestions.length}</td>
			<td>
				<ButtonLink style="button" href={`/api/game/${game.id}/report/download`}>Download Report</ButtonLink>
			</td>
		</tr>
	));
	return (
		<table className='w-100'>
			<thead>
				<tr>
					<th>ID</th>
					<th>Title</th>
					<th>Game date</th>
					<th>Status</th>
					<th>Questions</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	);
}

GameList.propTypes = {
	games: PropTypes.array.isRequired,
};

export default function Reports() {
	const [games, setGames] = useState([]);
	useEffect(() => {
		(async () => {
			const newGames = await Game.getAllGames();
			setGames(newGames);
		})();
	}, []);
	return (
		<div className="allreports p-2">
			<div>
				<h1>Your reports</h1>
			</div>
			<div>
				<GameList games={games} />
			</div>
		</div>
	);
}
