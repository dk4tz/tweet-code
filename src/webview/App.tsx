import React from 'react';
import { TweetComposer } from './components/TweetComposer';

interface AppProps {
	code: string;
}

export function App({ code }: AppProps) {
	return (
		<div className='max-w-2xl mx-auto p-4'>
			<TweetComposer code={code} />
		</div>
	);
}
