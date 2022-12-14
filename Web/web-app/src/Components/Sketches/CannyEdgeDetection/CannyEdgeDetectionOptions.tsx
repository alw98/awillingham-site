import { PrimaryButton } from 'Components/Buttons/PrimaryButton';
import { Checkbox } from 'Components/Inputs/Checkbox';
import { RangeSlider } from 'Components/Inputs/RangeSlider';
import { observer } from 'mobx-react';
import { CannyEdgeDetectionPropsStore } from 'Models/Sketches/CannyEdgeDetection/CannyEdgeDetectionPropsStore';
import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { BaseOptions } from '../BaseOptions';

interface CannyEdgeDetectionOptionsProps {
	propsStore: CannyEdgeDetectionPropsStore;
	onClose: () => void;
}

export const CannyEdgeDetectionOptions: React.FC<CannyEdgeDetectionOptionsProps> = observer(({ onClose, propsStore }) => {
	const styles = useStyles();

	return (
		<BaseOptions onClose={onClose}>
			<RangeSlider
				title='Smoothing Kernel Size'
				onChange={(val) => { propsStore.smoothingKernelSize = val; }}
				min={3}
				max={10}
				initialValue={propsStore.smoothingKernelSize}
				step={1} />
			<RangeSlider
				title='Upper Edge Threshold'
				onChange={(val) => { 
					propsStore.mustResize = true;
					propsStore.upperEdgeThreshold = val; 
				}}
				min={.1}
				max={10}
				initialValue={propsStore.upperEdgeThreshold}
				step={.1} />
			<RangeSlider
				title='Lower Edge Threshold'
				onChange={(val) => { 
					propsStore.mustResize = true;
					propsStore.lowerEdgeThreshold = val; 
				}}
				min={.1}
				max={10}
				initialValue={propsStore.lowerEdgeThreshold}
				step={.1} />
			<RangeSlider
				title='Edge Lightness Clamp'
				onChange={(val) => { 
					propsStore.mustResize = true;
					propsStore.lightnessBound = val; 
				}}
				min={1}
				max={100}
				initialValue={propsStore.lightnessBound}
				step={1} />
			<div className={styles.groupContainer}>
					Use Bilateral Smoothing
				<Checkbox checked={propsStore.useBilateralSmoothing} onChange={() => {
					propsStore.mustResize = true;
					propsStore.useBilateralSmoothing = !propsStore.useBilateralSmoothing;
				}} />
			</div>
			<PrimaryButton onClick={() => {
				propsStore.saveNextFrame = true;
			}}>
				Save image
			</PrimaryButton>
		</BaseOptions>
	);
});

const useStyles = createUseStyles((theme: Theme) => ({
	groupContainer: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		padding: '0rem .5rem',
		border: `1px solid ${theme.accentColor.primary}`
	},
}));