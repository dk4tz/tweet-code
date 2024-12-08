import * as vscode from 'vscode';
import { TwitterCredentials } from '../types';

const STORAGE_KEY = 'twitter-credentials';

export const authService = {
	async getCredentials(
		context: vscode.ExtensionContext
	): Promise<TwitterCredentials | undefined> {
		return context.globalState.get<TwitterCredentials>(STORAGE_KEY);
	},

	async saveCredentials(
		context: vscode.ExtensionContext,
		credentials: TwitterCredentials
	): Promise<void> {
		await context.globalState.update(STORAGE_KEY, credentials);
	},

	async clearCredentials(context: vscode.ExtensionContext): Promise<void> {
		await context.globalState.update(STORAGE_KEY, undefined);
	}
};
