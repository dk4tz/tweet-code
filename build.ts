/// <reference types="bun-types" />
import { BuildConfig } from 'bun';

async function build() {
	// Extension build configuration
	const extensionConfig: BuildConfig = {
		entrypoints: ['./src/extension.ts'],
		outdir: './dist',
		target: 'node',
		external: ['vscode'],
		format: 'cjs',
		splitting: false,
		naming: {
			entry: 'extension.js'
		},
		sourcemap: 'linked',
		root: '.'
	};

	// Webview build configuration
	const webviewConfig: BuildConfig = {
		entrypoints: ['./src/index.tsx'],
		outdir: './dist',
		target: 'browser',
		splitting: false,
		naming: {
			entry: 'webview.[ext]'
		},
		sourcemap: 'linked',
		root: '.'
	};

	try {
		// Build extension and webview
		const results = await Promise.all([
			Bun.build(extensionConfig),
			Bun.build(webviewConfig)
		]);

		// Check for build errors
		results.forEach((result, index) => {
			if (!result.success) {
				console.error(`Build ${index + 1} failed:`, result.logs);
				process.exit(1);
			}
		});

		// Build CSS
		const proc = Bun.spawn(
			[
				'tailwindcss',
				'-i',
				'./src/styles.css',
				'-o',
				'./dist/styles.css'
			],
			{
				stdout: 'inherit',
				stderr: 'inherit'
			}
		);

		const exitCode = await proc.exited;
		if (exitCode !== 0) {
			console.error('CSS build failed');
			process.exit(1);
		}

		console.log('Build complete!');
	} catch (error) {
		console.error('Build failed:', error);
		process.exit(1);
	}
}

build();
