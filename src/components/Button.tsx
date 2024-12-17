import React from 'react';

interface ButtonProps {
	onClick: () => void;
	disabled?: boolean;
	variant?: 'primary' | 'secondary';
	className?: string;
	children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
	onClick,
	disabled = false,
	variant = 'secondary',
	className = null,
	children
}) => {
	let baseStyles =
		'px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

	baseStyles = className ? baseStyles + ' ' + className : baseStyles;

	const variantStyles = {
		primary: `${
			disabled
				? 'bg-blue-400/60 cursor-not-allowed'
				: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
		} text-white`,
		secondary:
			'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
	};

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`${baseStyles} ${variantStyles[variant]}`}
		>
			{children}
		</button>
	);
};
