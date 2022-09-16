import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export const useWindowSize = (debounceTime?: number) => {
	const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);
	const [debouncedWindowSize] = useDebounce(windowSize, debounceTime ?? 0);

	useEffect(() => {
		const listener = () => {
			setWindowSize([window.innerWidth, window.innerHeight]);
		};
		window.addEventListener('resize', listener);

		return () => {
			window.removeEventListener('resize', listener);
		};
	}, []);

	return debouncedWindowSize;
};