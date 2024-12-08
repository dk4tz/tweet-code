import * as vscode from 'vscode';
import { getWebviewHtml } from './template';

export function createTweetWebview(
	context: vscode.ExtensionContext,
	code: string
): vscode.WebviewPanel {
	const panel = vscode.window.createWebviewPanel(
		'tweetPreview',
		'Tweet Code',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.joinPath(context.extensionUri, 'dist')
			]
		}
	);

	panel.webview.html = getWebviewHtml(panel, context, code);
	return panel;
}
