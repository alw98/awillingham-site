import { EulerProblem } from 'Models/ProjectEuler/EulerProblem';
import React from 'react';
import { createUseStyles } from 'react-jss';

interface EulerProblemComponentProps {
	problem: EulerProblem;
}

export const EulerProblemComponent: React.FC<EulerProblemComponentProps> = ({problem}) => {
	const styles = useStyles();
	return (
		<div key={problem.title} className={styles.eulerProblemContainer}>
			<span className={styles.title}>{problem.id}. {problem.title}</span>
			<span className={styles.question}>{problem.text}</span>
			<span>Answer: {problem.getAnswer().toString()}</span>
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