import { RangeSlider } from 'Components/Inputs/RangeSlider';
import { observer } from 'mobx-react';
import { CannyEdgeDetectionPropsStore } from 'Models/Sketches/CannyEdgeDetection/CannyEdgeDetectionPropsStore';
import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface CannyEdgeDetectionOptionsProps {
	propsStore: CannyEdgeDetectionPropsStore;
	onClose: () => void;
}

export const CannyEdgeDetectionOptions: React.FC<CannyEdgeDetectionOptionsProps> = observer(({ onClose, propsStore }) => {
	//const styles = useStyles();

	return (
		<BaseOptions onClose={onClose}>
			<RangeSlider
				title='Smoothing Kernel Size'
				onChange={(val) => { propsStore.smoothingKernelSize = val; }}
				min={3}
				max={25}
				initialValue={propsStore.smoothingKernelSize}
				step={1} />
		</BaseOptions>
	);
});

// const useStyles = createUseStyles((theme: Theme) => ({
// 	groupContainer: {
// 		display: 'flex',
// 		alignItems: 'center',
// 		flexDirection: 'column',
// 		padding: '0rem .5rem',
// 		border: `1px solid ${theme.accentColor.primary}`
// 	},
// }));