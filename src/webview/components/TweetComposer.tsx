import React, { useState } from 'react';

interface Props {
	code: string;
}

export function TweetComposer({ code }: Props) {
	const [text, setText] = useState(code);
	const remaining = 280 - text.length;
	const isValid = remaining >= 0;

	const handleTweet = () => {
		if (!isValid) return;
		window.vscode.postMessage({ command: 'tweet', text });
	};

	const handleCancel = () => {
		window.vscode.postMessage({ command: 'cancel' });
	};

	return (
		<div className='space-y-4'>
			<div className='bg-gray-800 rounded-lg p-4'>
				<pre className='text-gray-200 font-mono whitespace-pre-wrap overflow-auto'>
					{code}
				</pre>
			</div>

			<textarea
				value={text}
				onChange={(e) => setText(e.target.value)}
				className='w-full h-24 p-2 rounded border border-gray-300 resize-y focus:border-blue-500 focus:ring focus:ring-blue-200'
				placeholder='Edit your tweet...'
			/>

			<div
				className={`text-right ${
					isValid ? 'text-gray-600' : 'text-red-500'
				}`}
			>
				{remaining} characters remaining
			</div>

			<div className='flex justify-end space-x-2'>
				<button
					onClick={handleCancel}
					className='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300'
				>
					Cancel
				</button>
				<button
					onClick={handleTweet}
					disabled={!isValid}
					className={`px-4 py-2 rounded text-white ${
						isValid
							? 'bg-blue-500 hover:bg-blue-600'
							: 'bg-blue-300 cursor-not-allowed'
					}`}
				>
					Tweet
				</button>
			</div>
		</div>
	);
}
