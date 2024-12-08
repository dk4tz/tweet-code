import * as vscode from 'vscode';
import { TwitterCredentials } from '../types';

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
