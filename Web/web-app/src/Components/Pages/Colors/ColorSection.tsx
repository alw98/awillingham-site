
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

const useStyles = createUseStyles({
	sectionContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	contentContainer: {
		display: 'flex',
		width: '100%',
		padding: '.5rem',
	},
	title: {
		fontSize: '2rem',
		padding: '1rem'
	}
});