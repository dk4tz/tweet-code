import type { Response } from 'got';

export interface TwitterCredentials {
	consumerKey: string;
	consumerSecret: string;
	accessToken: string;
	accessSecret: string;
}

export interface TwitterSuccess {
	data: {
		id: string;
		text: string;
	};
}

export interface TwitterError {
	errors: Array<{
		code: number;
		message: string;
	}>;
}

export type TwitterAPIError = Error & {
	response: Response<TwitterError>;
};
