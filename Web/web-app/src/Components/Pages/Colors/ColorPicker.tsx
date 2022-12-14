import React, { useMemo, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { ColorPalletes } from 'Themes/ColorPalletes';

interface ColorPickerProps {
	onSelect: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({onSelect}) => {
	const styles = useStyles();
	const [selectedPallete, setSelectedPallete] = useState<undefined | string[]>();

	const mainColorsElements = useMemo(() => {
		const elements = Object.values(ColorPalletes).map((val, i) => {
			const mainColorOnClick = () => {
				setSelectedPallete(val);
			};
			return <div key={i} className={styles.mainColor} style={{backgroundColor: val[5]}} onClick={mainColorOnClick} />;
		});
		setSelectedPallete(ColorPalletes.prettyBlue);
		return <div className={styles.mainColorsContainer}>{elements}</div>;
	}, [ColorPalletes, setSelectedPallete]);

	const subColorsElements = useMemo(() => {
		if (!selectedPallete) return null;
		const elements = selectedPallete.map((val, i) => {
			const subColorOnClick = () => {
				onSelect(val);
			};
			return <div key={i} className={styles.mainColor} style={{backgroundColor: val}} onClick={subColorOnClick} />;
		});

		return <div className={styles.subColorsContainer}>{elements}</div>;
	}, [selectedPallete]);

	return (
		<div className={styles.container}>
			{mainColorsElements}
			{subColorsElements}
		</div>
	);
};

const useStyles = createUseStyles({
	palleteCard: {
		width: '2rem',
		height: '2rem',
	},
	palleteContainer: {
		display: 'flex'
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
		height: '4rem',
		width: '100%',
	},
	mainColorsContainer: {
		display: 'flex',
		flexDirection: 'row',
		flexGrow: 1
	},
	subColorsContainer: {
		display: 'flex',
		flexDirection: 'row',
		flexGrow: 1
	},
	mainColor: {
		flexGrow: 1,
	}
});
