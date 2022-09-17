import { PrimaryButton } from 'Components/Buttons/PrimaryButton';
import { ColorsPageSketch } from 'Components/Sketches/ColorsPage/ColorsPageSketch';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Theme } from 'Models/Theme';
import React, { useEffect, useState } from 'react';
import { createUseStyles, ThemeProvider } from 'react-jss';
import { PropsWithThemeStore } from 'Stores/ThemeStore';
import { recursiveCopyStrings } from 'Utils/RecursiveCopyStrings';

import { ContentPageContainer } from '../ContentPageContainer';
import { PrimaryButtonColors } from './PrimaryButtonColors';
import { PrimaryColors } from './PrimaryColors';
import { SecondaryColors } from './SecondaryColors';


export const ColorsPage: React.FC<PropsWithThemeStore> = observer(({themeStore: globalThemeStore}) => {
	const styles = useStyles();
	const [testStore] = useState(observable({theme: toJS(globalThemeStore.theme), renders: 0}));
	const localThemeJS = toJS(testStore.theme);

	useEffect(() => {
		console.log('change');
		recursiveCopyStrings(testStore, {theme: {...toJS(globalThemeStore.theme)}, renders: Math.random()});
	}, [globalThemeStore.theme]);
	
	const onSave = () => {
		globalThemeStore.theme = localThemeJS;
	};

	return (
		<ContentPageContainer>
			<ThemeProvider theme={{...localThemeJS}}>
				<div className={styles.content} onClick={() => testStore.renders += 1}>
					<PrimaryColors themeStore={testStore} renders={testStore.renders} />
					<SecondaryColors themeStore={testStore} renders={testStore.renders} />
					<PrimaryButtonColors themeStore={testStore} renders={testStore.renders} />
				</div>
			</ThemeProvider>
			<ColorsPageSketch theme={localThemeJS} />
			<PrimaryButton onClick={onSave} className={styles.saveButton}>Save</PrimaryButton>
		</ContentPageContainer>
	);
});

const useStyles = createUseStyles((theme: Theme) => ({
	content: {
		padding: '1rem',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		zIndex: 1,
		WebkitTextStroke: `1px ${theme.accentColor.primary}`
	},
	saveButton: {
		zIndex: 1
	}
}));
