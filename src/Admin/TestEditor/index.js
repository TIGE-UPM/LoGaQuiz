import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './TestEditor.scss';

import Components from '@Components';
import Form from '@Components/Form';
import * as Test from '../../store/test';

import QuestionEditor from './QuestionEditor';

const { ButtonLink } = Components;
const { TextInput } = Form;

function TestEditor() {
	const navigate = useNavigate();

	const { testId } = useParams();

	const [test, setTest] = useState(null);

	useEffect(() => {
		(async () => {
			if (testId === undefined) {
				setTest({
					title: '',
					questions: [],
				});
				return;
			}

			console.log(testId);
			setTest(await Test.getTestById(testId));
		})();
	}, []);

	async function saveTest() {
		if (testId === undefined) {
			const createdTest = await Test.createTest(test);
			console.log(createdTest);
			navigate(`/admin/tests/${createdTest.id}`);
			alert('Test creado correctamente');
			return;
		}

		await Test.updateTest(testId, test);
		alert('Test actualizado');
	}

	function setTitle(title) {
		test.title = title;
		setTest({ ...test });
	}

	const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

	function onNewQuestion() {
		test.questions.push({
			title: '',
			questionType: '',
			allocatedTime: 0,
			weight: 0,
			answers: [
				{
					title: '',
					isCorrect: false,
				},
			],
		});
		setTest({ ...test });
		setSelectedQuestionIndex(test.questions.length - 1);
	}
	function onQuestionChange(newSelectedQuestionIndex, question) {
		test.questions[newSelectedQuestionIndex] = question;
		setTest({ ...test });
	}

	return (
		<div className='test-editor-container p-2'>
			<div className='flex row justify-space-between align-items-center'>
				<label className='flex row align-items-center gap-1'>
					<h3 className=''>Test title:</h3>
					<TextInput
						value={test?.title ?? ''}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Insert test title..."
					/>
				</label>
				<ButtonLink style="button" onClick={saveTest}>Save test</ButtonLink>
			</div>

			<div className='questions-editor mt-2'>
				<div className='questions'>
					<ButtonLink style="button" onClick={onNewQuestion} className="new-question">
						New Question +
					</ButtonLink>
					{test?.questions?.map((question, index) => (
						<div className={`question-preview ${selectedQuestionIndex === index ? 'active' : ''}`} onClick={() => setSelectedQuestionIndex(index)} key={question.id ?? `q-${index}`}>
							<span>Question {index + 1}:</span>
							<span className='title'>{question.title ? question.title : 'Insert the title'}</span>
						</div>
					))}
				</div>
				<QuestionEditor
					className='grow-1'
					value={test?.questions?.[selectedQuestionIndex]}
					index={selectedQuestionIndex}
					onChange={(_question) => onQuestionChange(selectedQuestionIndex, _question)
					}
				></QuestionEditor>
			</div>

		</div>
	);
}

export default TestEditor;
