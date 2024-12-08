import * as vscode from 'vscode';
import { TwitterCredentials } from '../types';

const STORAGE_KEY = 'twitter-credentials';

export const authService = {
	async getCredentials(
		context: vscode.ExtensionContext
	): Promise<TwitterCredentials | undefined> {
		const credentials = await context.secrets.get(STORAGE_KEY);
		return credentials ? JSON.parse(credentials) : undefined;
	},

	async saveCredentials(
		context: vscode.ExtensionContext,
		credentials: TwitterCredentials
	): Promise<void> {
		await context.secrets.store(STORAGE_KEY, JSON.stringify(credentials));
	},

	async clearCredentials(context: vscode.ExtensionContext): Promise<void> {
		await context.secrets.delete(STORAGE_KEY);
	}
};
