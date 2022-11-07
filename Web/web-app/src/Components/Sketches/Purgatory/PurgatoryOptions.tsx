import { observer } from 'mobx-react';
import { PurgatoryPropsStore } from 'Models/Sketches/Purgatory/PurgatoryPropsStore';
import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface PurgatoryOptionsProps {
	propsStore: PurgatoryPropsStore;
	onClose: () => void;
}

export const PurgatoryOptions: React.FC<PurgatoryOptionsProps> = observer(({ onClose }) => {
	// const styles = useStyles();

	return (
		<BaseOptions onClose={onClose}>
			{/* <RangeSlider
				title='Grid Width'
				onChange={(val) => { propsStore.gridWidth = val; propsStore.mustResize = true; }}
				min={1}
				max={Math.floor(propsStore.width / 3)}
				initialValue={propsStore.gridWidth}
				step={1} /> */}
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