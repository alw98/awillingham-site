import { PrimaryButton } from 'Components/Buttons/PrimaryButton';
import { observer } from 'mobx-react';
import React, { PropsWithChildren } from 'react';
import { createUseStyles } from 'react-jss';


interface BaseOptionsProps {
	onClose: () => void;
}

export const BaseOptions: React.FC<BaseOptionsProps & PropsWithChildren> = observer(({onClose, children}) => {
	const styles = useStyles();
	
	return <div className={styles.container}>
		{children}
		<PrimaryButton onClick={onClose} className={styles.closeButton}>Close</PrimaryButton>
	</div>;
});

const useStyles = createUseStyles({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		padding: '1rem',
		alignItems: 'center',
		justifyContent: 'center',
	},
	closeButton: {
		marginLeft: 'auto',
	}
});