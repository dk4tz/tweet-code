import { AxiosResponse } from 'axios';

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
	response: AxiosResponse<TwitterError>;
};
