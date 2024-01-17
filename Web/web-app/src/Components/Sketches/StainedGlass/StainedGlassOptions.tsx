import { observer } from 'mobx-react';
import React from 'react';

import { BaseOptions } from '../BaseOptions';
import { StainedGlassSketchPropsStore } from 'Models/Sketches/StainedGlass/StainedGlassSketchPropsStore';
import { RangeSlider } from 'Components/Inputs/RangeSlider';
import { Checkbox } from 'Components/Inputs/Checkbox';
import { Theme } from 'Models/Theme';
import { createUseStyles } from 'react-jss';

interface StainedGlassOptionsProps {
	propsStore: StainedGlassSketchPropsStore;
	onClose: () => void;
}

export const StainedGlassOptions: React.FC<StainedGlassOptionsProps> = observer(({ propsStore, onClose }) => {
	const styles = useStyles();

	return (
		<BaseOptions onClose={onClose}>
			<div className={styles.groupContainer}>
				Show grid?
				<Checkbox 
					checked={propsStore.showGrid} 
					onChange={() => {
						propsStore.showGrid = !propsStore.showGrid;
						propsStore.mustResize = true;
					}} 
				/>
			</div>
			<RangeSlider
				title='Grid Width'
				onChange={(val) => { propsStore.gridCellWidth = val; propsStore.mustResize = true; }}
				min={1}
				max={Math.floor(propsStore.width / 4)}
				initialValue={propsStore.gridCellWidth}
				step={1} />
			<RangeSlider
				title='Grid Height'
				onChange={(val) => { propsStore.gridCellHeight = val; propsStore.mustResize = true; }}
				min={1}
				max={Math.floor(propsStore.height / 3)}
				initialValue={propsStore.gridCellHeight}
				step={1} />
			<RangeSlider
				title='Strip Count'
				onChange={(val) => { propsStore.stripCount = val; propsStore.mustResize = true; }}
				min={1}
				max={200}
				initialValue={propsStore.stripCount}
				step={1} />
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