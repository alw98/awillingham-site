import { PrimaryButton } from 'Components/Buttons/PrimaryButton';
import { ColorsPageSketch } from 'Components/Sketches/ColorsPage/ColorsPageSketch';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles, ThemeProvider } from 'react-jss';
import { PropsWithThemeStore } from 'Stores/ThemeStore';

import { ContentPageContainer } from '../ContentPageContainer';
import { PrimaryButtonColors } from './PrimaryButtonColors';
import { PrimaryColors } from './PrimaryColors';
import { SecondaryColors } from './SecondaryColors';


export const ColorsPage: React.FC<PropsWithThemeStore> = observer(({themeStore}) => {
	const styles = useStyles();

	const localThemeJS = toJS({...themeStore.colorPageThemeStore.theme});

	const onSave = () => {
		themeStore.theme = localThemeJS;
	};

	return (
		<ContentPageContainer>
			<ThemeProvider theme={localThemeJS}>
				<div className={styles.content} >
					<PrimaryColors themeStore={themeStore.colorPageThemeStore} />
					<SecondaryColors themeStore={themeStore.colorPageThemeStore} />
					<PrimaryButtonColors themeStore={themeStore.colorPageThemeStore} />
				</div>
			</ThemeProvider>
			<ColorsPageSketch theme={toJS(themeStore.colorPageThemeStore.theme)} />
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
