import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { Header } from '../components/Header';
import { ImageGenerator } from '../components/ImageGenerator';
import { useVSCode } from '../contexts/vscode';
import { TwitterCredentials } from '../types';

interface ComposerPageProps {
	code: string;
	initialCredentials?: TwitterCredentials;
}

export const ComposerPage: React.FC<ComposerPageProps> = ({
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

	useEffect(() => {
		if (initialCredentials) {
			setCredentials(initialCredentials);
		} else {
			handleLoadCredentials();
		}
	}, [initialCredentials]);

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
	}, [credentials]);

	return (
		<div className='space-y-4'>
			<Header
				title='Tweet Preview'
				isConnected={isConnected}
				onLoadCredentials={handleLoadCredentials}
				isPosting={isPosting}
			/>

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
					placeholder='Enter your tweet...'
				/>

				<div className='flex items-center justify-between text-sm'>
					<span
						className={`${
							text.length > CHAR_CEILING
								? 'text-red-500'
								: 'text-neutral-500 dark:text-neutral-400'
						}`}
					>
						{text.length < CHAR_CEILING
							? text.length + ' characters'
							: -1 * (text.length - CHAR_CEILING) +
							  ' characters over'}
					</span>
				</div>

				<ImageGenerator disabled={isPosting} />
			</div>

			<ErrorMessage message={error} />

			<div className='flex justify-between pt-2'>
				<Button
					onClick={handleCancel}
					disabled={isPosting}
					variant='secondary'
				>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					disabled={!isValid || isPosting}
					variant='primary'
				>
					{isPosting ? 'Posting...' : 'Post Tweet'}
				</Button>
			</div>
		</div>
	);
};
