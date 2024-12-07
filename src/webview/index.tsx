import React from 'react';
import { createRoot } from 'react-dom/client';
import { VSCodeAPI } from '../types';
import { App } from './App';
import './styles.css';

declare global {
	interface Window {
		initialData: {
			code: string;
		};
		vscode: VSCodeAPI;
	}
}

const { code } = window.initialData;
const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
	<React.StrictMode>
		<App code={code} />
	</React.StrictMode>
);
