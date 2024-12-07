/// <reference types="bun-types" />

async function build() {
	// Build extension
	await Promise.all([
		Bun.build({
			entrypoints: ['./src/extension.ts'],
			outdir: './dist',
			target: 'node',
			external: ['vscode'],
			format: 'cjs'
		}),
		Bun.build({
			entrypoints: ['./src/webview/index.tsx'],
			outdir: './dist',
			target: 'browser',
			naming: 'webview.[ext]'
		})
	]);

	const proc = Bun.spawn([
		'tailwindcss',
		'-i',
		'./src/webview/styles.css',
		'-o',
		'./dist/styles.css'
	]);
	await proc.exited;
}

build();
