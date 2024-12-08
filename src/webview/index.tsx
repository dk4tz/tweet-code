import React from 'react';
import { createRoot } from 'react-dom/client';
import type { WebviewApi } from 'vscode-webview';
import { TwitterCredentials } from '../types';
import { App } from './App';
import { VSCodeProvider } from './contexts/vscode';
import './styles.css';

declare function acquireVsCodeApi(): WebviewApi<unknown>;

declare global {
	interface Window {
		initialData: {
			code: string;
			credentials?: TwitterCredentials;
		};
		vscode: WebviewApi<unknown>;
	}
}

window.vscode = acquireVsCodeApi();
const { code, credentials } = window.initialData;

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
	<React.StrictMode>
		<VSCodeProvider>
			<App code={code} credentials={credentials} />
		</VSCodeProvider>
	</React.StrictMode>
);
