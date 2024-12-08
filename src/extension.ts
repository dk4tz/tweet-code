import * as vscode from 'vscode';
import { authService } from './services/auth';
import { twitterService } from './services/twitter';
import { TwitterAPIError } from './types';
import { getWebviewHtml } from './webview/template';

export async function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'tweet-code.share',
		async () => {
			try {
				const editor = vscode.window.activeTextEditor;
				if (!editor?.selection) {
					throw new Error('No code selected');
				}

				const code = editor.document.getText(editor.selection);
				if (!code.trim()) {
					throw new Error('Please select code to share');
				}

				const credentials = await authService.getCredentials(context);
				const panel = vscode.window.createWebviewPanel(
					'tweetPreview',
					'Tweet Code',
					vscode.ViewColumn.One,
					{ enableScripts: true }
				);

				panel.webview.html = getWebviewHtml(
					panel,
					context,
					code,
					credentials
				);

				panel.webview.onDidReceiveMessage(async (message) => {
					try {
						switch (message.command) {
							case 'tweet':
								await twitterService.postTweet(
									message.credentials,
									message.text
								);
								await authService.saveCredentials(
									context,
									message.credentials
								);
								await vscode.window.showInformationMessage(
									'Tweet posted successfully!'
								);
								panel.dispose();
								break;

							case 'cancel':
								panel.dispose();
								break;
						}
					} catch (error: unknown) {
						let errorMessage = 'Failed to post tweet';

						if (error instanceof Error) {
							errorMessage = error.message;

							const apiError = error as TwitterAPIError;
							if (apiError.response?.body?.errors?.[0]) {
								errorMessage =
									apiError.response.body.errors[0].message;
							}
						}

						panel.webview.postMessage({
							type: 'error',
							message: errorMessage
						});
					}
				});
			} catch (error) {
				vscode.window.showErrorMessage(
					error instanceof Error
						? error.message
						: 'An unexpected error occurred'
				);
			}
		}
	);

	context.subscriptions.push(disposable);
}
