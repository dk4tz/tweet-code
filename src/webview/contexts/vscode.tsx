import React, { createContext, useCallback, useContext, useState } from 'react';

interface VSCodeState {
	error: string | null;
	isPosting: boolean;
}

interface VSCodeContextType extends VSCodeState {
	postMessage: (message: unknown) => void;
	setError: (error: string | null) => void;
	setIsPosting: (posting: boolean) => void;
}

const VSCodeContext = createContext<VSCodeContextType | null>(null);

export function VSCodeProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<VSCodeState>({
		error: null,
		isPosting: false
	});

	const postMessage = useCallback((message: unknown) => {
		window.vscode?.postMessage(message);
	}, []);

	const setError = useCallback((error: string | null) => {
		setState((prev) => ({ ...prev, error }));
	}, []);

	const setIsPosting = useCallback((isPosting: boolean) => {
		setState((prev) => ({ ...prev, isPosting }));
	}, []);

	return (
		<VSCodeContext.Provider
			value={{
				...state,
				postMessage,
				setError,
				setIsPosting
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
