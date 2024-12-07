// src/extension.ts
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'tweet-code.share',
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor?.selection) return;

			const code = editor.document.getText(editor.selection);
			if (!code.trim()) {
				vscode.window.showErrorMessage('Please select code to share');
				return;
			}

			const panel = vscode.window.createWebviewPanel(
				'tweetPreview',
				'Share Code',
				vscode.ViewColumn.One,
				{ enableScripts: true }
			);

			const styleUri = panel.webview.asWebviewUri(
				vscode.Uri.file(
					path.join(context.extensionPath, 'dist', 'styles.css')
				)
			);

			const scriptUri = panel.webview.asWebviewUri(
				vscode.Uri.file(
					path.join(context.extensionPath, 'dist', 'webview.js')
				)
			);

			panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width,initial-scale=1.0">
                    <link href="${styleUri}" rel="stylesheet">
                </head>
                <body>
                    <div id="root"></div>
                    <script>
                        window.initialData = {
                            code: ${JSON.stringify(code)}
                        };
                    </script>
                    <script src="${scriptUri}"></script>
                </body>
            </html>
        `;

			panel.webview.onDidReceiveMessage(
				async (message: { command: string; text?: string }) => {
					switch (message.command) {
						case 'tweet':
							try {
								// Tweet implementation would go here
								await vscode.window.showInformationMessage(
									'Code shared!'
								);
								panel.dispose();
							} catch (error) {
								vscode.window.showErrorMessage(
									'Failed to share code'
								);
							}
							break;
						case 'cancel':
							panel.dispose();
							break;
					}
				}
			);
		}
	);

	context.subscriptions.push(disposable);
}
