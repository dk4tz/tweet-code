import crypto from 'crypto';
import got from 'got';
import OAuth from 'oauth-1.0a';
import { TwitterCredentials, TwitterSuccess } from '../types';

export const twitterService = {
	createOAuthInstance(credentials: TwitterCredentials): OAuth {
		return new OAuth({
			consumer: {
				key: credentials.consumerKey,
				secret: credentials.consumerSecret
			},
			signature_method: 'HMAC-SHA1',
			hash_function: (baseString, key) =>
				crypto
					.createHmac('sha1', key)
					.update(baseString)
					.digest('base64')
		});
	},

	async postTweet(
		credentials: TwitterCredentials,
		text: string
	): Promise<TwitterSuccess> {
		const oauth = this.createOAuthInstance(credentials);
		const url = 'https://api.twitter.com/2/tweets';

		const token = {
			key: credentials.accessToken,
			secret: credentials.accessSecret
		};

		const authHeader = oauth.toHeader(
			oauth.authorize(
				{
					url,
					method: 'POST'
				},
				token
			)
		);

		const response = await got.post<TwitterSuccess>(url, {
			json: { text },
			responseType: 'json',
			headers: {
				Authorization: authHeader['Authorization'],
				'Content-Type': 'application/json'
			}
		});

		return response.body;
	}
};
