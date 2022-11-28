import React from 'react';
import PropTypes from 'prop-types';

import Components from '@Components';
import Form from '@Components/Form';

import './QuestionEditor.scss';

const { ButtonLink } = Components;
const { TextInput } = Form;

function QuestionEditor({ value = null, onChange = () => {}, className = '', index }) {
	const question = value ? JSON.parse(JSON.stringify(value)) : null;

	function setQuestionTitle(event) {
		question.title = event.target.value;
		onChange(question);
	}

	function addNewAnswer() {
		question.answers.push({
			title: '',
			isCorrect: false,
		});
		onChange(question);
	}

	function setAnswerTitle(i, title) {
		question.answers[i].title = title;
		onChange(question);
	}

	function setAnswerCorrect(i, isCorrect) {
		question.answers[i].isCorrect = isCorrect;
		onChange(question);
	}

	function setQuestionAllocatedTime(time) {
		question.allocatedTime = time;
		onChange(question);
	}

	function setQuestionWeight(weight) {
		question.weight = weight;
		onChange(question);
	}

	if (!question) {
		return (
			<div className='question-editor-container'>
				<h1>¡There is no question in the test!</h1>
				<span>Add a new question</span>
			</div>
		);
	}

	return (
		<div className={`question-editor-container ${className}`}>
			<div className='editor flex column align-items-center grow-1 gap-2'>
				<h1 className='title font-primary-hard'>
					{`Question ${index + 1}`}
				</h1>
				<h2 className='title'>
					{question.title ? question.title : 'Insert the title'}
				</h2>
				<TextInput
					className="col-fix-8"
					value={question.title}
					onChange={setQuestionTitle}
					placeholder="Insert question title..."
				/>
				<div className='flex column align-items-start gap-2'>
					{/* TODO: Delete  answers */}
					<ButtonLink style="button" onClick={addNewAnswer}>Add answer</ButtonLink>
					<table>
						<thead>
							<tr>
								<th></th>
								<th>Answer</th>
								<th>Correct answer?</th>
							</tr>
						</thead>
						<tbody>
							{question.answers.map((answer, i) => (
								<tr className='answer' key={answer.id ?? `a-${i}`}>
									<td>{i + 1}</td>
									<td>
										<TextInput
											value={question?.answers[i].title}
											onChange={(e) => setAnswerTitle(i, e.target.value)}
											placeholder="Insert answer..."
											align="center"
										/>
									</td>
									<td>
										<input
											type="checkbox"
											onChange={(e) => setAnswerCorrect(i, e.target.checked)}
											checked={question?.answers[i].isCorrect}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div className='flex column col-fix-3 p-1 gap-2'>
				<span className='font-5 font-bold'>Settings</span>
				<label>
					Allocated Time (seconds)
					<TextInput
						type="number"
						step="0.1"
						value={question?.allocatedTime}
						onChange={(e) => setQuestionAllocatedTime(e.target.value)}
						placeholder="Insert allocated time..."
						align="center"
					/>
				</label>
				<label>
					Score
					<TextInput
						type="number"
						step="1"
						value={question?.weight}
						onChange={(e) => setQuestionWeight(e.target.value)}
						placeholder="Insert weight..."
						align="center"
					/>
				</label>
			</div>
		</div>
	);
}

QuestionEditor.propTypes = {
	value: PropTypes.object,
	onChange: PropTypes.func,
	index: PropTypes.number,
	className: PropTypes.string,
};

export default QuestionEditor;
