import * as vscode from 'vscode';

export class AuthenticationService {
	private static readonly TWITTER_AUTH_PROVIDER = 'twitter';
	private static readonly REQUIRED_SCOPES = ['tweet.write'];

	static async getTwitterToken(): Promise<string> {
		const session = await vscode.authentication.getSession(
			this.TWITTER_AUTH_PROVIDER,
			this.REQUIRED_SCOPES,
			{ createIfNone: true }
		);

		if (!session) {
			throw new Error('Failed to authenticate with Twitter');
		}

		return session.accessToken;
	}
}
