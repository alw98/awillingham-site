import { observer } from 'mobx-react';
import React from 'react';

import { BaseOptions } from '../BaseOptions';
import { BaseSketchPropsStore } from 'Models/Sketches/BaseSketchPropsStore';

interface SnowGlobeOptionsProps {
	propsStore: BaseSketchPropsStore;
	onClose: () => void;
}

export const SnowGlobeOptions: React.FC<SnowGlobeOptionsProps> = observer(({ onClose }) => {
	//const styles = useStyles();

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