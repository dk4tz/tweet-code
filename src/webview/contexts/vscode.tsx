import React, {
	createContext,
	useCallback,
	useContext,
	useState,
	useEffect
} from 'react';
import { TwitterCredentials } from '../../types';

interface VSCodeState {
	error: string | null;
	isPosting: boolean;
	credentials: Partial<TwitterCredentials>;
	isConnected: boolean;
}

interface VSCodeContextType extends VSCodeState {
	postMessage: (message: unknown) => void;
	setError: (error: string | null) => void;
	setIsPosting: (posting: boolean) => void;
	setCredentials: (credentials: Partial<TwitterCredentials>) => void;
	checkConnection: () => void;
}

const VSCodeContext = createContext<VSCodeContextType | null>(null);

export function VSCodeProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<VSCodeState>({
		error: null,
		isPosting: false,
		credentials: window.initialData?.credentials || {},
		isConnected: false
	});

	const checkConnection = useCallback(() => {
		const hasValidCredentials = !!(
			state.credentials.consumerKey?.trim() &&
			state.credentials.consumerSecret?.trim() &&
			state.credentials.accessToken?.trim() &&
			state.credentials.accessSecret?.trim()
		);

		setState((prev) => ({ ...prev, isConnected: hasValidCredentials }));
	}, [state.credentials]);

	const postMessage = useCallback((message: unknown) => {
		window.vscode?.postMessage(message);
	}, []);

	const setError = useCallback((error: string | null) => {
		setState((prev) => ({ ...prev, error }));
	}, []);

	const setIsPosting = useCallback((isPosting: boolean) => {
		setState((prev) => ({ ...prev, isPosting }));
	}, []);

	const setCredentials = useCallback(
		(credentials: Partial<TwitterCredentials>) => {
			setState((prev) => ({ ...prev, credentials }));
		},
		[]
	);

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			const message = event.data;
			switch (message.type) {
				case 'error':
					setError(message.message);
					setIsPosting(false);
					if (
						message.message.toLowerCase().includes('auth') ||
						message.message.toLowerCase().includes('credentials') ||
						message.message.toLowerCase().includes('unauthorized')
					) {
						setState((prev) => ({ ...prev, isConnected: false }));
					}
					break;
				case 'credentials':
					setCredentials(message.credentials || {});
					break;
			}
		};

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	}, [setError, setIsPosting, setCredentials]);

	useEffect(() => {
		checkConnection();
	}, [state.credentials, checkConnection]);

	return (
		<VSCodeContext.Provider
			value={{
				...state,
				postMessage,
				setError,
				setIsPosting,
				setCredentials,
				checkConnection
			}}
		>
			{children}
		</VSCodeContext.Provider>
	);
}

export function useVSCode() {
	const context = useContext(VSCodeContext);
	if (!context) {
		throw new Error('useVSCode must be used within a VSCodeProvider');
	}
	return context;
}
