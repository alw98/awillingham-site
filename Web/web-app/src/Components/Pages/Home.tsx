import React from 'react';
import { createUseStyles } from 'react-jss';
import Gearbox from 'wwwroot/images/GearAnimation.gif';

import { ContentPageContainer } from './ContentPageContainer';

export const HomePage: React.FC = () => {
	const styles = useStyles();

	return (
		<ContentPageContainer>
			<div className={styles.body}>
				This is a gallery made by Armond Willingham, with love and care. It's still a work in progress.
				<a href='https://github.com/alw98/awillingham-site'>Source</a>
			</div>
			<img src={Gearbox} className={styles.gearboxImage} alt={'WIP'}/>
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
	gearboxImage: {
		maxWidth: '100%',
		maxHeight: '100%',
	}
});