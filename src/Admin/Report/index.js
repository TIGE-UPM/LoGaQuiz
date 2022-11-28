import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';

import * as Game from '../../store/game';
import './Report.css';

function GameList(props) {
	const { games } = props;

	if (!games?.length) {
		return (
			<p>No tienes tests</p>
		);
	}

	const rows = games.map((game) => (
		<tr key={game.id}>
			<td>{game.id}</td>
			<td>{game.playedTest.title}</td>
			<td>{game.startTime}</td>
			<td>{game.status}</td>
			<td>{game.playedTest.playedQuestions.length}</td>
			<td><Link to={`/admin/report/${game.id}`}>Ver Report</Link></td>
		</tr>
	));
	return (
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Título</th>
					<th>Fecha de juego</th>
					<th>Estado</th>
					<th>Preguntas</th>
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

export default function Report() {
	const { gameId } = useParams();
	const [game, setGame] = useState(null);
	useEffect(() => {
		(async () => {
			const newGame = await Game.getGame(gameId);
			setGame(newGame);
		})();
	}, []);
	return (
		<div className="allreports">
			<div>
				<h1>Tus Reportes</h1>
			</div>
			<div>
				{game?.id}
			</div>
		</div>
	);
}
