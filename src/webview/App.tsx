import React from 'react';
import { TwitterCredentials } from '../types';
import { TweetComposer } from './pages/TweetComposer';

interface AppProps {
	code: string;
	credentials?: TwitterCredentials;
}

export function App({ code, credentials }: AppProps) {
	return (
		<div className='max-w-2xl mx-auto p-4'>
			<TweetComposer code={code} initialCredentials={credentials} />
		</div>
	);
}
