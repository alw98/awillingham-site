import { Theme } from 'Models/Theme';
import React, { useCallback, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Range } from 'react-range';
import { useDebounce } from 'use-debounce';


interface RangeSliderProps {
	title: string;
	onChange: (value: number) => void;
	min: number;
	max: number;
	initialValue: number;
	step?: number;
	extendable?: boolean;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({title, onChange, initialValue, extendable, ...props}) => {
	const styles = useStyles();
	const [values, setValues] = useState([initialValue]);
	const [min, setMin] = useState(props.min);
	const [max, setMax] = useState(props.max);
	const [step, setStep] = useState(props.step ?? 1);
	const [disabled, setDisabled] = useState(false);

	const round = (val: number, places: number) => {
		const scaler = Math.pow(10, places);
		return Math.round(scaler * val) / scaler;
	};

	const resize = useCallback((val: number) => {
		if(extendable) {
			if(val === min) {
				const newMin = min / 2;
				const newStep = (val - newMin) / 10;
				setMin(round(min / 2, 5));
				setMax(round(val + newStep, 5));
				setStep(round(newStep, 5));
				setDisabled(true);
				setTimeout(() => setDisabled(false), 50);
			} else if(val === max) {
				const newMax = max * 2;
				const newStep = (newMax - val) / 10;
				setMax(round(max * 2, 5));
				setMin(round(val - newStep, 5));
				setStep(round(newStep, 5));
				setDisabled(true);
				setTimeout(() => setDisabled(false), 50);
			}
		}
	}, [extendable, values, min, max]);
	
	const [debouncedResize] = useDebounce(resize, 100, { leading: true, trailing: false });

	const onValuesChange = (newValues: number[]) => {		
		const val = newValues[0];
		setValues(newValues);
		onChange(val);
		if(extendable && (val === min || val === max)){
			debouncedResize(val);
		}
	};

	return (
		<div className={styles.container}>
			<span className={styles.title}>{title}: {values[0]}</span>
			{	!disabled && 
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
				step={step} />}
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
	},
	disabled: {
		display: 'none'
	}
}));