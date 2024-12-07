export interface VSCodeAPI {
	postMessage: (message: Message) => void;
}

export type Message =
	| { command: 'tweet'; text: string }
	| { command: 'cancel' };
