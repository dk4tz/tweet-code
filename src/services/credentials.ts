import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TwitterCredentials } from '../types';

const CREDENTIALS_FILENAME = '.twitter-credentials';

const parseCredentialsFile = (content: string): Partial<TwitterCredentials> => {
	const credentials: Partial<TwitterCredentials> = {};

	content.split('\n').forEach((line) => {
		const [key, value] = line.split('=').map((s) => s.trim());
		switch (key) {
			case 'TWITTER_CONSUMER_KEY':
				credentials.consumerKey = value;
				break;
			case 'TWITTER_CONSUMER_SECRET':
				credentials.consumerSecret = value;
				break;
			case 'TWITTER_ACCESS_TOKEN':
				credentials.accessToken = value;
				break;
			case 'TWITTER_ACCESS_SECRET':
				credentials.accessSecret = value;
				break;
		}
	});

	return credentials;
};

const validateCredentials = (
	credentials: Partial<TwitterCredentials>
): credentials is TwitterCredentials => {
	return !!(
		credentials.consumerKey &&
		credentials.consumerSecret &&
		credentials.accessToken &&
		credentials.accessSecret
	);
};

export const credentialsService = {
	load(): TwitterCredentials | undefined {
		try {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders) {
				throw new Error('No workspace folder found');
			}

			const credentialsPath = path.join(
				workspaceFolders[0].uri.fsPath,
				CREDENTIALS_FILENAME
			);

			if (!fs.existsSync(credentialsPath)) {
				return undefined;
			}

			const content = fs.readFileSync(credentialsPath, 'utf8');
			const credentials = parseCredentialsFile(content);

			return validateCredentials(credentials) ? credentials : undefined;
		} catch (error) {
			console.error('Error loading credentials:', error);
			throw new Error('Failed to load Twitter credentials');
		}
	},

	createTemplate(workspaceFolder: string): void {
		const template = `TWITTER_CONSUMER_KEY=your_consumer_key_here
TWITTER_CONSUMER_SECRET=your_consumer_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here`;

		const filePath = path.join(workspaceFolder, CREDENTIALS_FILENAME);

		if (!fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, template);

			// Add to .gitignore
			const gitignorePath = path.join(workspaceFolder, '.gitignore');
			if (fs.existsSync(gitignorePath)) {
				fs.appendFileSync(gitignorePath, `\n${CREDENTIALS_FILENAME}\n`);
			}
		}
	}
};
