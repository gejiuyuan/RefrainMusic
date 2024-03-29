/** @format */

module.exports = {
	appId: 'com.refrain.app',
	productName: 'refrain-music',
	directories: {
		buildResources: 'build',
		output: 'dist-client',
	},
	files: [
		'**/*',
		'!**/.md',
		'!**/.vscode/*',
		'!**/electron.vite.config.{js,ts,mjs,cjs}',
		'!{.eslintignore,.editorconfig,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}',
		'!{.env,.env.*,.npmrc,pnpm-lock.yaml,yarn.lock}',
		'!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}',
	],
	afterSign: 'build/notarize.js',
	extends: null,
	win: {
		target: [
			{
				target: 'portable',
				arch: 'x64',
			},
			{
				target: 'nsis',
				arch: 'x64',
			},
		],
		icon: 'build/icon.png',
		executableName: 'refrain-music',
		artifactName: '${productName}.v${version}.${os}-${arch}.${ext}',
	},
	nsis: {
		oneClick: false,
		artifactName: '${name}-${version}-setup.${ext}',
		shortcutName: '${productName}',
		uninstallDisplayName: '${productName}',
		createDesktopShortcut: 'always',
		createStartMenuShortcut: true,
		perMachine: true,
		installerIcon: 'build/icon.png',
		uninstallerIcon: 'build/icon.png',
		allowToChangeInstallationDirectory: true,
		allowElevation: true,
	},
	mac: {
		icon: 'build/icon.png',
		entitlementsInherit: 'build/entitlements.mac.plist',
		extendInfo: {
			NSCameraUsageDescription: `Application requests access to the device's camera.`,
			NSMicrophoneUsageDescription: `Application requests access to the device's microphone.`,
			NSDocumentsFolderUsageDescription: `Application requests access to the user's Documents folder.`,
			NSDownloadsFolderUsageDescription: `Application requests access to the user's Downloads folder.`,
		},
	},
	dmg: {
		artifactName: '${name}-${version}.${ext}',
	},
	linux: {
		target: ['AppImage', 'snap', 'deb'],
		maintainer: 'electronjs.org',
		category: 'Utility',
		icon: 'build/icon.png',
	},
	appImage: {
		artifactName: '${name}-${version}.${ext}',
	},
	npmRebuild: false,
	publish: {
		provider: 'generic',
		url: 'https://refrain-music.vercel.app',
	},
};
