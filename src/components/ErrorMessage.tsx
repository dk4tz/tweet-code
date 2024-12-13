import React from 'react';

interface ErrorMessageProps {
	message: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
	if (!message) return null;

	return (
		<div
			className='p-3 rounded-lg text-sm font-medium 
        bg-red-50 dark:bg-red-900/20 
        border border-red-100 dark:border-red-800
        text-red-600 dark:text-red-400'
		>
			{message}
		</div>
	);
};
