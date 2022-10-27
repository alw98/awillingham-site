import { useWorker } from '@koale/useworker';
import { EulerProblem } from 'Models/ProjectEuler/EulerProblem';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

interface EulerProblemComponentProps {
	problem: EulerProblem;
}

export const EulerProblemComponent: React.FC<EulerProblemComponentProps> = ({problem}) => {
	const [answer, setAnswer] = useState('Calculating...');
	const [getAnswerWorker] = useWorker(problem.getAnswer);
	const styles = useStyles();
	
	useEffect(() => {
		const setAnswerFn = async () => {
			setAnswer('' + await getAnswerWorker());
		};

		setAnswerFn();
	}, []);
	return (
		<div key={problem.title} className={styles.eulerProblemContainer}>
			<span className={styles.title}>{problem.id}. {problem.title}</span>
			<span className={styles.question}>{problem.text}</span>
			<span>Answer: {answer}</span>
		</div>
	);
};

const useStyles = createUseStyles({
	body: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '1rem 2rem 2rem 2rem',
	},
	eulerProblemContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		paddingBottom: '1rem',
		textAlign: 'center'
	},
	title: {
		fontSize: '1.5rem'
	},
	question: {
		whiteSpace: 'pre-wrap'
	}
});