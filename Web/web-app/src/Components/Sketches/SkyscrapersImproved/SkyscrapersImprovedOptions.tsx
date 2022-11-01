import { RangeSlider } from 'Components/Inputs/RangeSlider';
import { observer } from 'mobx-react';
import { SkyscrapersSketchPropsStore } from 'Models/Sketches/Skyscrapers/SkyscrapersSketchPropsStore';
import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { BaseOptions } from '../BaseOptions';

interface SkyscrapersImprovedOptionsProps {
	propsStore: SkyscrapersSketchPropsStore;
	onClose: () => void;
}

export const SkyscrapersImprovedOptions: React.FC<SkyscrapersImprovedOptionsProps> = observer(({propsStore, onClose}) => {	
	const styles = useStyles();

	return (
		<BaseOptions onClose={onClose}>
			<RangeSlider
				title='Skyscraper Count'
				onChange={(val) => { propsStore.startCount = val; propsStore.mustResize = true; }}
				min={1}
				max={1000}
				initialValue={propsStore.startCount}
				step={1} />
			<RangeSlider
				title='Outline Draw Delay'
				onChange={(val) => { propsStore.updateDelay = val; propsStore.mustResize = true; }}
				min={.01}
				max={1}
				initialValue={propsStore.updateDelay}
				step={.01} />
			<div className={styles.groupContainer}>
				Height
				<RangeSlider
					title='Skyscraper Min Height'
					onChange={(val) => { propsStore.minSSHeight = val; propsStore.mustResize = true; }}
					min={1}
					max={1000}
					initialValue={propsStore.minSSHeight}
					step={1} />
				<RangeSlider
					title='Skyscraper Max Height'
					onChange={(val) => { propsStore.maxSSHeight = val; propsStore.mustResize = true; }}
					min={1}
					max={1000}
					initialValue={propsStore.maxSSHeight}
					step={1} />
			</div>
			<div className={styles.groupContainer}>
				Width
				<RangeSlider
					title='Skyscraper Min Width'
					onChange={(val) => { propsStore.minSSWidth = val; propsStore.mustResize = true; }}
					min={1}
					max={1000}
					initialValue={propsStore.minSSWidth}
					step={1} />
				<RangeSlider
					title='Skyscraper Max Width'
					onChange={(val) => { propsStore.maxSSWidth = val; propsStore.mustResize = true; }}
					min={1}
					max={1000}
					initialValue={propsStore.maxSSWidth}
					step={1} />
			</div>
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