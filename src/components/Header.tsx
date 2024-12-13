import React from 'react';

interface HeaderProps {
	title: string;
	isConnected: boolean;
	onLoadCredentials: () => void;
	isPosting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
	title,
	isConnected,
	onLoadCredentials,
	isPosting
}) => {
	return (
		<div className='flex justify-between items-center mb-6'>
			<h2 className='text-lg font-medium text-neutral-800 dark:text-neutral-200'>
				{title}
			</h2>
			<button
				onClick={onLoadCredentials}
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
	);
};
