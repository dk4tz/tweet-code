import * as vscode from 'vscode';

import { credentialsService } from './services/credentials';
import { twitterService } from './services/twitter';
import { TwitterAPIError } from './types';
import { getWebviewHtml } from './webview';

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

				const panel = vscode.window.createWebviewPanel(
					'tweetPreview',
					'Tweet Code',
					vscode.ViewColumn.One,
					{ enableScripts: true }
				);

				// Initial HTML without credentials
				panel.webview.html = getWebviewHtml(panel, context, code);

				panel.webview.onDidReceiveMessage(async (message) => {
					try {
						switch (message.command) {
							case 'tweet':
								try {
									await twitterService.postTweet(
										message.credentials,
										message.text
									);
									panel.dispose();
									await vscode.window.showInformationMessage(
										'Tweet, tweet!'
									);
								} catch (error: unknown) {
									let errorMessage = 'Failed to post tweet';

									if (error instanceof Error) {
										errorMessage = error.message;

										const apiError =
											error as TwitterAPIError;
										if (
											apiError.response?.data?.errors?.[0]
										) {
											errorMessage =
												apiError.response.data.errors[0]
													.message;
										}
									}

									panel.webview.postMessage({
										type: 'error',
										message: errorMessage
									});
								}
								break;

							case 'loadCredentials':
								const loadedCredentials =
									credentialsService.load();
								if (!loadedCredentials) {
									if (vscode.workspace.workspaceFolders) {
										credentialsService.createTemplate(
											vscode.workspace.workspaceFolders[0]
												.uri.fsPath
										);
										throw new Error(
											'Please fill in your Twitter credentials in the newly created .twitter-credentials file'
										);
									}
									throw new Error(
										'No workspace folder found to create credentials file'
									);
								}
								panel.webview.postMessage({
									type: 'credentials',
									credentials: loadedCredentials
								});
								break;

							case 'cancel':
								panel.dispose();
								break;
						}
					} catch (error: unknown) {
						let errorMessage = 'Failed to complete operation';

						if (error instanceof Error) {
							errorMessage = error.message;
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
