import React, { PropsWithChildren } from 'react';
import { createUseStyles } from 'react-jss';

export const ColorDisplaysContainer: React.FC<PropsWithChildren> = ({children}) => {
	const styles = useStyles();
	
	return (
		<div className={styles.container} >
			{children}
		</div>
	);
};

const useStyles = createUseStyles({
	container: {
		display: 'flex',
		flexDirection: 'column',
	}
});