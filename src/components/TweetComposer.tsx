import React, { useEffect, useState } from 'react';

import { useVSCode } from '../contexts/vscode';
import { TwitterCredentials } from '../types';

interface Props {
	code: string;
	initialCredentials?: TwitterCredentials;
}

export const TweetComposer: React.FC<Props> = ({
	code,
	initialCredentials
}) => {
	const {
		postMessage,
		error,
		isPosting,
		credentials,
		isConnected,
		setError,
		setIsPosting,
		setCredentials
	} = useVSCode();
	const [text, setText] = useState(code);

	const CHAR_CEILING = 25000;

	// Load credentials on mount
	useEffect(() => {
		const loadInitialCredentials = () => {
			if (initialCredentials) {
				setCredentials(initialCredentials);
			} else {
				handleLoadCredentials();
			}
		};

		loadInitialCredentials();
	}, [initialCredentials, setCredentials]);

	const isValid =
		text.trim().length > 0 && text.length <= CHAR_CEILING && isConnected;

	const handleSubmit = () => {
		if (!isValid || isPosting) return;
		setIsPosting(true);
		setError(null);
		postMessage({
			command: 'tweet',
			text,
			credentials
		});
	};

	const handleCancel = () => {
		setIsPosting(false);
		setError(null);
		postMessage({ command: 'cancel' });
	};

	const handleLoadCredentials = () => {
		setError(null);
		postMessage({ command: 'loadCredentials' });
	};

	useEffect(() => {
		const hasCredentials = Object.values(credentials).some((val) => val);
		if (!hasCredentials) {
			setError(null);
		}
	}, [credentials, setError]);

	return (
		<div className='space-y-4'>
			{/* Header with connection status */}
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-lg font-medium text-neutral-800 dark:text-neutral-200'>
					Tweet Preview
				</h2>
				<button
					onClick={handleLoadCredentials}
					disabled={isPosting}
					className='inline-flex items-center space-x-2 px-3 py-1.5 text-sm rounded-full 
                        border border-neutral-200 dark:border-neutral-700
                        hover:bg-neutral-100 dark:hover:bg-neutral-800
                        disabled:opacity-50 disabled:cursor-not-allowed'
				>
					<span
						className={`w-2 h-2 rounded-full ${
							isConnected ? 'bg-green-500' : 'bg-red-500'
						}`}
					/>
					<span className='text-neutral-600 dark:text-neutral-300'>
						{isConnected ? 'Connected' : 'Disconnected'}
					</span>
				</button>
			</div>

			{/* Main content area */}
			<div className='space-y-4'>
				<textarea
					value={text}
					onChange={(e) => setText(e.target.value)}
					disabled={isPosting}
					className='w-full p-4 rounded-lg border font-mono text-sm
                        bg-white dark:bg-neutral-900
                        border-neutral-200 dark:border-neutral-700
                        text-neutral-800 dark:text-neutral-200
                        placeholder-neutral-400 dark:placeholder-neutral-600
                        disabled:bg-neutral-50 dark:disabled:bg-neutral-800
                        disabled:cursor-not-allowed
                        min-h-[200px] resize-y'
					placeholder='Enter your tweet content...'
				/>

				<div className='flex items-center justify-between text-sm'>
					<span
						className={`${
							text.length > CHAR_CEILING
								? 'text-red-500'
								: 'text-neutral-500 dark:text-neutral-400'
						}`}
					>
						{CHAR_CEILING - text.length} characters remaining
					</span>
				</div>
			</div>

			{/* Error message */}
			{error && (
				<div
					className='p-3 rounded-lg text-sm font-medium 
                    bg-red-50 dark:bg-red-900/20 
                    border border-red-100 dark:border-red-800
                    text-red-600 dark:text-red-400'
				>
					{error}
				</div>
			)}

			{/* Action buttons */}
			<div className='flex justify-between pt-2'>
				<button
					onClick={handleCancel}
					disabled={isPosting}
					className='px-4 py-2 rounded-md
                        bg-neutral-100 dark:bg-neutral-800
                        text-neutral-700 dark:text-neutral-300
                        hover:bg-neutral-200 dark:hover:bg-neutral-700
                        disabled:opacity-50 disabled:cursor-not-allowed'
				>
					Cancel
				</button>
				<button
					onClick={handleSubmit}
					disabled={!isValid || isPosting}
					className={`px-4 py-2 rounded-md transition-colors ${
						!isValid || isPosting
							? 'bg-blue-400/60 cursor-not-allowed'
							: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
					} text-white`}
				>
					{isPosting ? 'Posting...' : 'Post Tweet'}
				</button>
			</div>
		</div>
	);
};
