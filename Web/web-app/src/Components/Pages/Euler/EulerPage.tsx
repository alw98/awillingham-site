import { EulerProblemList } from 'Models/ProjectEuler/EulerProblemList';
import React, { useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { PropsWithThemeStore } from 'Stores/ThemeStore';

import { ContentPageContainer } from '../ContentPageContainer';
import { EulerProblemComponent } from './EulerProblemComponent';


export const EulerPage: React.FC<PropsWithThemeStore> = () => {
	const styles = useStyles();

	const questions = useMemo(() => {
		return EulerProblemList.map((val) => {
			return <EulerProblemComponent key={val.id} problem={val} />;
		});
	}, []);

	return (
		<ContentPageContainer>
			<div className={styles.body}>
				{questions}
			</div>
		</ContentPageContainer>
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
		paddingBottom: '1rem'
	},
	title: {
		fontSize: '1.5rem'
	},
	question: {
		whiteSpace: 'pre-wrap'
	}
});