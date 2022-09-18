import { Theme } from 'Models/Theme';
import React, { PropsWithChildren } from 'react';
import { createUseStyles } from 'react-jss';


export const PageContainer: React.FC<PropsWithChildren> = ({children}) => {
	const styles = useStyles();
	
	return <div className={styles.pageContainer}>{children}</div>;
};

const useStyles = createUseStyles((theme: Theme) => ({
	pageContainer: {
		overflow: 'auto',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: theme.backgroundColor.primary,
		color: theme.textColor.primary,
		flexGrow: 1
	}
}));