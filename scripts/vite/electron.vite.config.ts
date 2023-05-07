/** @format */
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import RenderViteConfig from './vite.config';
import path from 'path';

export default defineConfig({
	main: {
		publicDir: path.join(process.cwd(), 'client/main/public'),
		build: {
			watch: {},
			outDir: 'dist/main',
			rollupOptions: {
				input: {
					index: path.join(process.cwd(), 'client/main/index.ts'),
				},
			},
			minify: true,
		},
		plugins: [externalizeDepsPlugin()],
	},
	preload: {
		publicDir: path.join(process.cwd(), 'client/preload/public'),
		build: {
			outDir: 'dist/preload',
			rollupOptions: {
				watch: {},
				input: {
					index: path.join(process.cwd(), 'client/preload/index.ts'),
				},
			},
			minify: true,
		},
		plugins: [externalizeDepsPlugin()],
	},
	renderer: RenderViteConfig,
});
