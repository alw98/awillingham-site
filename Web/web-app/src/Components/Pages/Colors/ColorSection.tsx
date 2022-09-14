
import { Theme } from 'Models/Theme';
import React, { PropsWithChildren } from 'react';
import { createUseStyles } from 'react-jss';

interface ColorSectionProps {
	title: string;
}

export const ColorSection: React.FC<ColorSectionProps & PropsWithChildren> = ({title, children}) => {
	const styles = useStyles();

	return (
		<div className={styles.sectionContainer}>
			<span className={styles.title}>{title}</span>
			<div className={styles.contentContainer}>
				{children}
			</div>
		</div>
	);
};

const useStyles = createUseStyles((theme: Theme) => ({
	sectionContainer: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: theme.backgroundColor.primary,
		alignItems: 'center',
	},
	contentContainer: {
		display: 'flex',
		padding: '.5rem',
	},
	title: {
		padding: '1rem',
	}
}));