import React from 'react';

import { TweetComposer } from './components/TweetComposer';
import { TwitterCredentials } from './types';

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
