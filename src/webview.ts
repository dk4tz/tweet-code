import * as vscode from 'vscode';
import { TwitterCredentials } from './types';

// Webview creation
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

// HTML template
export function getWebviewHtml(
	panel: vscode.WebviewPanel,
	context: vscode.ExtensionContext,
	code: string,
	credentials?: TwitterCredentials
): string {
	const scriptUri = panel.webview.asWebviewUri(
		vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview.js')
	);
	const styleUri = panel.webview.asWebviewUri(
		vscode.Uri.joinPath(context.extensionUri, 'dist', 'styles.css')
	);

	return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleUri}" rel="stylesheet">
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.initialData = {
            code: ${JSON.stringify(code)},
            credentials: ${JSON.stringify(credentials)}
          };
        </script>
        <script src="${scriptUri}"></script>
      </body>
    </html>
  `;
}
