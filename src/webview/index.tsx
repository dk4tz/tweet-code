// src/webview/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import type { WebviewApi } from 'vscode-webview';
import { TwitterCredentials } from '../types';
import { App } from './App';
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

const vscode = acquireVsCodeApi();
const { code, credentials } = window.initialData;

window.vscode = vscode;

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
	<React.StrictMode>
		<App code={code} credentials={credentials} />
	</React.StrictMode>
);
