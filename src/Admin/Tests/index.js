import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Components from '@Components';
import * as Test from '../../store/test';
import * as Game from '../../store/game';

import './Tests.scss';

const { ButtonLink } = Components;

function TestList(props) {
	const { tests } = props;
	const navigate = useNavigate();

	if (!tests?.length) {
		return (
			<p>You don&apos;t have tests</p>
		);
	}

	async function newGame(testId) {
		console.log(testId);
		const game = await Game.newGame(testId);
		console.log(game);
		navigate(`/admin/game/${game.id}`);
	}

	const rows = tests.map((test) => (
		<tr key={test.id}>
			<td>{test.id}</td>
			<td>{test.title}</td>
			<td>{test.createdAt}</td>
			<td>
				<ButtonLink className="mx-1" style="button" to={`/admin/tests/${test.id}`}>Edit</ButtonLink>
				<ButtonLink className="mx-1" style="button" onClick={() => newGame(test.id)}>Play</ButtonLink>
			</td>
		</tr>
	));
	return (
		<table className='w-100'>
			<thead>
				<tr>
					<th>ID</th>
					<th>Title</th>
					<th>Creation date</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	);
}

TestList.propTypes = {
	tests: PropTypes.array.isRequired,
};

export default function Tests() {
	const [tests, setTests] = useState([]);
	useEffect(() => {
		(async () => {
			const newTests = await Test.getAllTests();
			setTests(newTests);
		})();
	}, []);

	return (
		<div className="tests-container p-2">
			<div className='flex row justify-space-between align-items-center'>
				<h1>Your tests</h1>
				<ButtonLink style="button" to="/admin/tests/new">Create new test</ButtonLink>
			</div>
			<TestList tests={tests} />
		</div>
	);
}
