import React, { useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { ColorPalletes } from 'Themes/ColorPalletes';

export const ColorPicker: React.FC = () => {
	const styles = useStyles();
	const colorPalleteElements = useMemo(() => {
		const palleteContainers = Object.values(ColorPalletes).map((pallete, i) => {
			const palleteElements = pallete.map((color, i) => {
				return <span className={styles.palleteCard} style={{backgroundColor: color}} key={i} />;
			});

			return <div className={styles.palleteContainer} key={i}>{palleteElements}</div>;
		});
		return <div className={styles.allPalletesContainer}>{palleteContainers}</div>; 
	}, [ColorPalletes, styles]);

	return colorPalleteElements;
};

const useStyles = createUseStyles({
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
});
