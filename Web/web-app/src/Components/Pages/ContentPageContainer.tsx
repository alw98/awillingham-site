import { Theme } from 'Models/Theme';
import React, { PropsWithChildren } from 'react';
import { createUseStyles } from 'react-jss';


export const ContentPageContainer: React.FC<PropsWithChildren> = ({children}) => {
	const styles = useStyles();

	return (
		<div className={styles.pageContainer}>
			{children}
		</div>
	);
};

const useStyles = createUseStyles((theme: Theme) => ({
	pageContainer: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: theme.backgroundColor.primary,
		alignItems: 'center',
	}
}));