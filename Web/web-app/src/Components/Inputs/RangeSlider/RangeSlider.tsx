import { Theme } from 'Models/Theme';
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Range } from 'react-range';


interface RangeSliderProps {
	title: string;
	onChange: (value: number) => void;
	min: number;
	max: number;
	initialValue: number;
	step?: number;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({title, onChange, min, max, step, initialValue}) => {
	const styles = useStyles();
	const [values, setValues] = useState([initialValue]);
	
	const onValuesChange = (newValues: number[]) => {
		setValues(newValues);
		onChange(newValues[0]);
	};

	return (
		<div className={styles.container}>
			<span className={styles.title}>{title}: {values[0]}</span>
			<Range 
				renderTrack={({props, children}) => (
					<div 
						{...props} 
						className={styles.track}>
						{children}
					</div>
				)}
				renderThumb={({props}) => (<div {...props} className={styles.thumb} />)} 
				onChange={onValuesChange}
				values={values}
				min={min}
				max={max}
				step={step} />
		</div>
	);
};

const useStyles = createUseStyles((theme: Theme) => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		padding: '.5rem',
		minWidth: '10rem',
		alignItems: 'center',
	},
	title: {
		fontSize: '1rem',
		paddingBottom: '.25rem',
	},
	input: {
		'&::-webkit-slider-runnable-track': {
			WebkitAppearance: 'none',
			backgroundColor: theme.button.backgroundColor.primary,
			borderRadius: '2rem',
		},
		'&::-webkit-slider-thumb': {
			WebkitAppearance: 'none',
			height: '2rem',
			background: theme.accentColor.primary
		}
	},
	thumb: {
		width: '1rem',
		height: '1rem',
		backgroundColor: theme.button.textColor.primary,
		borderRadius: '2rem',
	},
	track: {
		backgroundColor: theme.button.backgroundColor.primary,
		width: '100%',
		height: '.25rem',
		borderRadius: '2rem',
	}
}));