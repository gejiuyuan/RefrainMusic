/** @format */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import {
	app,
	shell,
	BrowserWindow,
	screen,
	ipcMain,
	Menu,
	MenuItemConstructorOptions,
	protocol,
} from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from './public/refrain.png?asset';
import Koa from 'koa';
import Router from 'koa-router';
import Static from 'koa-static';
import KoaServerHttpProxy from 'koa-server-http-proxy';
import * as path from 'path';
import { fstat, writeFile, readFile, write } from 'fs';
import { URL } from 'url';
import os from 'os';

import {
	LOCAL_SERVER_ADRESS,
	LOCAL_SERVER_PORT,
	NCMAPI_PORT,
	NCMAPI_SERVER_ADRESS,
} from './config/server';

app.commandLine.appendSwitch('block-insecure-private-network-requests', 'Disabled');

function createProtocol(scheme: string, customProtocol?: typeof protocol) {
	(customProtocol || protocol).registerBufferProtocol(scheme, (request, respond) => {
		let pathName = new URL(request.url).pathname;
		pathName = decodeURI(pathName); // Needed in case URL contains spaces

		readFile(path.join(__dirname, pathName), (error, data) => {
			if (error) {
				console.error(`Failed to read ${pathName} on ${scheme} protocol`, error);
			}
			const extension = path.extname(pathName).toLowerCase();
			let mimeType = '';

			if (extension === '.js') {
				mimeType = 'text/javascript';
			} else if (extension === '.html') {
				mimeType = 'text/html';
			} else if (extension === '.css') {
				mimeType = 'text/css';
			} else if (extension === '.svg' || extension === '.svgz') {
				mimeType = 'image/svg+xml';
			} else if (extension === '.json') {
				mimeType = 'application/json';
			} else if (extension === '.wasm') {
				mimeType = 'application/wasm';
			}

			respond({ mimeType, data });
		});
	});
}

function startUpLocalServer() {
	return new Promise((resolve, reject) => {
		let koaApp: Koa | null = new Koa();
		const lcoalServer = koaApp
			.use(Static(join(__dirname, '../renderer')))
			.use(
				KoaServerHttpProxy('/api', {
					target: NCMAPI_SERVER_ADRESS,
					changeOrigin: true,
					pathRewrite: (path) => path.replace(/^\/api/, ''),
				}),
			)
			.listen(LOCAL_SERVER_PORT, () => {
				resolve(true);
			})
			.on('error', (err) => {
				reject(err);
			});

		app.on('quit', () => {
			lcoalServer.close();
			koaApp = null;
		});
	});
}

function startLocalAndNCMAPIServer() {
	return Promise.allSettled([
		require('NeteaseCloudMusicApi').serveNcmApi({
			port: NCMAPI_PORT,
		}),
		startUpLocalServer(),
	]);
}

function createWindow() {
	const primaryDisplay = screen.getPrimaryDisplay();
	const { width, height } = primaryDisplay.workAreaSize;

	const mainWindow = new BrowserWindow({
		x: 0,
		y: 0,
		width,
		height,
		show: true,
		fullscreenable: true,
		skipTaskbar: false,
		// autoHideMenuBar: true,
		...(process.platform === 'linux' ? { icon } : { icon }),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false,
			webSecurity: false,
			contextIsolation: false,
			nodeIntegration: true,
			allowRunningInsecureContent: true,
		},
	});

	mainWindow.on('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: 'deny' };
	});

	// HMR for renderer base on electron-vite cli.
	if (is.dev) {
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] || 'http://localhost');
	} else {
		createProtocol('app');
		mainWindow.loadURL(LOCAL_SERVER_ADRESS);
	}

	const template: MenuItemConstructorOptions[] = [
		{
			label: '开发者扩展工具',
			click(menuItem) {
				mainWindow.webContents.openDevTools();
			},
		},
	];
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);

	ipcMain.on('show-context-menu', (event) => {
		menu.popup({
			window: BrowserWindow.fromWebContents(event.sender)!,
		});
	});
}

app.whenReady().then(() => {
	electronApp.setAppUserModelId('com.electron');

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	app.on('quit', () => {});

	if (is.dev) {
		createWindow();
	} else {
		startLocalAndNCMAPIServer().then((res) => {
			createWindow();
		});
	}
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
