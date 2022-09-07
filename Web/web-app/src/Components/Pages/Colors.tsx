import React, { useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { ColorPalletes } from 'Themes/ColorPalletes';

export const ColorsPage: React.FC = () => {
	const styles = useStyles();
	const colorPalleteElements = useMemo(() => {
		const palleteContainers = Object.values(ColorPalletes).map((pallete) => {
			const palleteElements = pallete.map((color) => {
				return <span className={styles.palleteCard} style={{backgroundColor: color}} />;
			});

			return <div className={styles.palleteContainer}>{palleteElements}</div>;
		});
		return <div className={styles.allPalletesContainer}>{palleteContainers}</div>; 
	}, [ColorPalletes, styles]);

	return (
		<div className={styles.pageContainer}>{colorPalleteElements}</div>
	);
};

const useStyles = createUseStyles(() => ({
	pageContainer: {
		display: 'flex'
	},
	palleteCard: {
		width: '2rem',
		height: '2rem',
	},
	palleteContainer: {
		display: 'flex'
	},
	allPalletesContainer: {
		display: 'flex',
		flexDirection: 'column'
	}
}));