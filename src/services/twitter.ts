import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import axios from 'axios';
import { TwitterCredentials, TwitterSuccess } from '../types';

const createOAuthInstance = (credentials: TwitterCredentials): OAuth => {
	// OAuth consumer should use the API key (consumer key) from your developer app
	const consumer = {
		key: credentials.consumerKey,
		secret: credentials.consumerSecret
	};

	return new OAuth({
		consumer,
		signature_method: 'HMAC-SHA1',
		hash_function: (baseString, key) =>
			crypto.createHmac('sha1', key).update(baseString).digest('base64')
	});
};

export const postTweet = async (
	credentials: TwitterCredentials,
	text: string
): Promise<TwitterSuccess> => {
	const oauth = createOAuthInstance(credentials);
	const endpointURL = 'https://api.twitter.com/2/tweets';

	// Access token credentials for the user making the request
	const token = {
		key: credentials.accessToken,
		secret: credentials.accessSecret
	};

	const requestData = {
		url: endpointURL,
		method: 'POST'
	};

	const authHeader = oauth.toHeader(oauth.authorize(requestData, token));

	// console.log('OAuth Parameters:', {
	// 	consumerKey: credentials.consumerKey,
	// 	accessToken: credentials.accessToken,
	// 	requestData,
	// 	authHeader: authHeader['Authorization']
	// });

	try {
		const response = await axios.post<TwitterSuccess>(
			endpointURL,
			{ text },
			{
				headers: {
					Authorization: authHeader['Authorization'],
					'Content-Type': 'application/json'
				}
			}
		);

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Twitter API Error:', {
				status: error.response?.status,
				data: error.response?.data,
				requestHeaders: error.config?.headers,
				authHeader: authHeader['Authorization']
			});

			throw new Error(
				`Twitter API Error (${error.response?.status}): ${
					typeof error.response?.data === 'object' &&
					error.response?.data !== null
						? JSON.stringify(error.response.data)
						: error.message
				}`
			);
		}
		throw error;
	}
};

export const twitterService = {
	postTweet
};
