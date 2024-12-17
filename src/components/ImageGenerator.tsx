import { usePollinationsImage } from '@pollinations/react';
import React, { useEffect, useState } from 'react';
import { Button } from './Button';

interface ImageGeneratorProps {
	disabled?: boolean;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ disabled }) => {
	const [imagePrompt, setImagePrompt] = useState('');
	const [isGenerating, setIsGenerating] = useState(false);
	const [generationSeed, setGenerationSeed] = useState<number>(0);
	const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

	const generatedImageUrl = usePollinationsImage(
		isGenerating ? imagePrompt : '',
		{
			width: 1600,
			height: 900,
			model: 'flux-pro',
			nologo: true,
			enhance: true,
			seed: generationSeed
		}
	);

	// Update currentImageUrl when generation completes
	useEffect(() => {
		if (isGenerating && generatedImageUrl) {
			console.log('Image generation completed:', generatedImageUrl);
			setCurrentImageUrl(generatedImageUrl);
			setIsGenerating(false);
		}
	}, [generatedImageUrl, isGenerating]);

	const handleGenerateImage = () => {
		if (!imagePrompt.trim() || isGenerating) return;
		console.log('Generating new image with prompt:', imagePrompt);
		setIsGenerating(true);
		setGenerationSeed(Date.now());
	};

	return (
		<div className='space-y-2'>
			<textarea
				value={imagePrompt}
				onChange={(e) => setImagePrompt(e.target.value)}
				disabled={isGenerating || disabled}
				className='w-full p-4 rounded-lg border font-mono text-sm
          bg-white dark:bg-neutral-900
          border-neutral-200 dark:border-neutral-700
          text-neutral-800 dark:text-neutral-200
          placeholder-neutral-400 dark:placeholder-neutral-600
          disabled:bg-neutral-50 dark:disabled:bg-neutral-800
          disabled:cursor-not-allowed
          min-h-[100px] resize-y'
				placeholder='Enter image description...'
			/>

			<Button
				onClick={handleGenerateImage}
				disabled={!imagePrompt.trim() || isGenerating || disabled}
				variant='secondary'
				className='w-full'
			>
				{isGenerating ? 'Generating Image...' : 'Generate Image'}
			</Button>

			{currentImageUrl && (
				<div className='mt-4 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700'>
					<img
						src={currentImageUrl}
						alt='Generated image'
						className='w-full h-auto'
					/>
				</div>
			)}
		</div>
	);
};
