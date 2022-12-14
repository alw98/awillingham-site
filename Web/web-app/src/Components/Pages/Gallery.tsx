import { GallerySketches } from 'Components/Sketches/GallerySketches';
import { useInject } from 'inversify-hooks';
import { observable, toJS } from 'mobx';
import { BaseSketchPropsStore } from 'Models/Sketches/BaseSketchPropsStore';
import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Link } from 'react-router-dom';
import { Stores } from 'Stores/Stores';
import { ThemeStore } from 'Stores/ThemeStore';


export const Gallery: React.FC = () => {
	const styles = useStyles();
	const [themeStore] = useInject<ThemeStore>(Stores.ThemeStore);

	const galleryElements = GallerySketches.map((val, i) => {
		const propsStore = observable<BaseSketchPropsStore>({
			...toJS(val.propsStore),
			isGallery: true,
			width: 320,
			height: 320
		});

		return (
			<Link 
				key={i} 
				title={val.propsStore.name} 
				className={styles.sketchContainer} 
				to={val.propsStore.name}>
				<val.sketch key={i} propsStore={propsStore} themeStore={themeStore} />
			</Link>
		);
	});

	return (
		<div className={styles.contentContainer}>
			{galleryElements}
		</div>
	);
};

const useStyles = createUseStyles((theme: Theme) => ({
	contentContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-evenly',
		padding: '1rem'
	},
	sketchContainer: {
		padding: '1rem',
		border: `1px solid ${theme.accentColor.primary}`,
		marginBottom: '1rem',
	}
}));