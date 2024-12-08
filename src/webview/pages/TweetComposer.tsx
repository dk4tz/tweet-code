import React, { useState } from 'react';
import { TwitterCredentials } from '../../types';
import { useVSCode } from '../contexts/vscode';

interface Props {
	code: string;
	initialCredentials?: TwitterCredentials;
}

export const TweetComposer: React.FC<Props> = ({
	code,
	initialCredentials
}) => {
	const { postMessage, error, isPosting, setError, setIsPosting } =
		useVSCode();
	const [text, setText] = useState(code);
	const [credentials, setCredentials] = useState<Partial<TwitterCredentials>>(
		initialCredentials || {}
	);

	const CHAR_CEILING = 25000;

	const isValid =
		text.trim().length > 0 &&
		text.length <= CHAR_CEILING &&
		credentials.consumerKey?.trim() &&
		credentials.consumerSecret?.trim() &&
		credentials.accessToken?.trim() &&
		credentials.accessSecret?.trim();

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
		postMessage({ command: 'cancel' });
	};

	return (
		<div className='space-y-6 p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg'>
			<div className='overflow-hidden rounded-md bg-neutral-900'>
				<div className='px-4 py-2 bg-neutral-800 border-b border-neutral-700'>
					<h2 className='text-sm font-medium text-neutral-200'>
						Code Preview
					</h2>
				</div>
				<pre className='p-4 text-sm text-neutral-200 font-mono text-wrap overflow-auto'>
					{code}
				</pre>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div className='space-y-2'>
					<label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
						Consumer Key
					</label>
					<input
						type='password'
						value={credentials.consumerKey || ''}
						onChange={(e) =>
							setCredentials((prev) => ({
								...prev,
								consumerKey: e.target.value
							}))
						}
						disabled={isPosting}
						className='w-full px-3 py-2 rounded-md border bg-white dark:bg-neutral-900 
                     border-neutral-300 dark:border-neutral-700 
                     disabled:bg-neutral-100 dark:disabled:bg-neutral-800
                     disabled:cursor-not-allowed'
						placeholder='Enter Consumer Key'
					/>
				</div>

				<div className='space-y-2'>
					<label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
						Consumer Secret
					</label>
					<input
						type='password'
						value={credentials.consumerSecret || ''}
						onChange={(e) =>
							setCredentials((prev) => ({
								...prev,
								consumerSecret: e.target.value
							}))
						}
						disabled={isPosting}
						className='w-full px-3 py-2 rounded-md border bg-white dark:bg-neutral-900 
                     border-neutral-300 dark:border-neutral-700 
                     disabled:bg-neutral-100 dark:disabled:bg-neutral-800
                     disabled:cursor-not-allowed'
						placeholder='Enter Consumer Secret'
					/>
				</div>

				<div className='space-y-2'>
					<label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
						Access Token
					</label>
					<input
						type='password'
						value={credentials.accessToken || ''}
						onChange={(e) =>
							setCredentials((prev) => ({
								...prev,
								accessToken: e.target.value
							}))
						}
						disabled={isPosting}
						className='w-full px-3 py-2 rounded-md border bg-white dark:bg-neutral-900 
                     border-neutral-300 dark:border-neutral-700 
                     disabled:bg-neutral-100 dark:disabled:bg-neutral-800
                     disabled:cursor-not-allowed'
						placeholder='Enter Access Token'
					/>
				</div>

				<div className='space-y-2'>
					<label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
						Access Token Secret
					</label>
					<input
						type='password'
						value={credentials.accessSecret || ''}
						onChange={(e) =>
							setCredentials((prev) => ({
								...prev,
								accessSecret: e.target.value
							}))
						}
						disabled={isPosting}
						className='w-full px-3 py-2 rounded-md border bg-white dark:bg-neutral-900 
                     border-neutral-300 dark:border-neutral-700 
                     disabled:bg-neutral-100 dark:disabled:bg-neutral-800
                     disabled:cursor-not-allowed'
						placeholder='Enter Access Token Secret'
					/>
				</div>
			</div>

			<div className='space-y-2'>
				<label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
					Tweet Content
				</label>
				<textarea
					value={text}
					onChange={(e) => setText(e.target.value)}
					disabled={isPosting}
					className='w-full px-3 py-2 rounded-md border bg-white dark:bg-neutral-900 
                   border-neutral-300 dark:border-neutral-700 
                   disabled:bg-neutral-100 dark:disabled:bg-neutral-800
                   disabled:cursor-not-allowed
                   min-h-[120px] resize-y'
					placeholder='Customize your tweet...'
				/>
				<div
					className={`text-sm ${
						text.length > CHAR_CEILING
							? 'text-red-500'
							: 'text-neutral-500 dark:text-neutral-400'
					}`}
				>
					{CHAR_CEILING - text.length} characters remaining
				</div>
			</div>

			{error && (
				<div className='p-3 rounded-md bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm'>
					{error}
				</div>
			)}

			<div className='flex justify-end gap-3'>
				<button
					onClick={handleCancel}
					disabled={isPosting}
					className='px-4 py-2 rounded-md bg-neutral-200 dark:bg-neutral-700 
                   text-neutral-700 dark:text-neutral-300
                   hover:bg-neutral-300 dark:hover:bg-neutral-600
                   disabled:opacity-50 disabled:cursor-not-allowed'
				>
					Cancel
				</button>
				<button
					onClick={handleSubmit}
					disabled={!isValid || isPosting}
					className={`px-4 py-2 rounded-md transition-colors
            ${
				!isValid || isPosting
					? 'bg-blue-300 dark:bg-blue-800 text-white cursor-not-allowed opacity-60'
					: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
			}`}
				>
					{isPosting ? 'Posting...' : 'Tweet'}
				</button>
			</div>
		</div>
	);
};
