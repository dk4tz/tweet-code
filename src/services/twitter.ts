import { TwitterApi } from 'twitter-api-v2';
import { AuthenticationService } from './auth';

export class TwitterService {
	private client: TwitterApi | null = null;

	async initialize(): Promise<void> {
		const token = await AuthenticationService.getTwitterToken();
		this.client = new TwitterApi(token);
	}

	async postTweet(text: string): Promise<void> {
		if (!this.client) {
			await this.initialize();
		}

		try {
			await this.client!.v2.tweet(text);
		} catch (error: any) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'An unknown error occurred';
			throw new Error(`Failed to post tweet: ${errorMessage}`);
		}
	}
}
