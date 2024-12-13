import React from 'react';

import { ComposerPage } from './pages/ComposerPage';
import { TwitterCredentials } from './types';

interface AppProps {
	code: string;
	credentials?: TwitterCredentials;
}

export function App({ code, credentials }: AppProps) {
	return (
		<div className='max-w-2xl mx-auto p-4'>
			<ComposerPage code={code} initialCredentials={credentials} />
		</div>
	);
}
