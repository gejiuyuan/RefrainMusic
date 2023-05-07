/** @format */
import path from 'path';
import { defineConfig, UserConfig } from 'vite';
//vue 3 jsx synxtax
import VueJsx from '@vitejs/plugin-vue-jsx';
//插件：解析.svg成内联元素
import svgLoader from 'vite-svg-loader';
//插件：解析.vue单文件组件
import vue from '@vitejs/plugin-vue';
//插件：导入jpg、png、webp、gif和svg图片的插件
import image from '@rollup/plugin-image';
import { VitePWA } from 'vite-plugin-pwa';
//插件：解析.md文件
// import Markdown from 'vite-plugin-md';
//导入配置文件
import viteConstant from './constant';
import manualChunksHandler from './manualChunk';

const pathResolve = (rest: string) => path.join(process.cwd(), rest);

const rendererConfig: UserConfig = {
	//配置运行环境，即import.meta.env.MODE（client.js中的window.process.env.NODE_ENV = __MODE__的值）
	//可选值：development、production
	mode: process.env.NODE_ENV,

	//项目根目录，用于查找vite配置文件(vite服务器运行的虚拟目录) 。默认：process.cwd()，npm run执行命令的目录
	root: process.cwd(),

	//需要支持的静态资源格式（默认支持字体、图片和媒体文件格式）
	assetsInclude: [
		/\.(png|jpeg|gif|jpg|svg|webp|avif)$/,
		/\.(mp4|webm|m3u8|avi)$/,
		/\.(ttf|woff|woff2|eot|otf)$/,
	],
	//以便import().then()动态导入支持更多格式转换成js语法。在2.0.0-beta.3之后已移除
	// transformInclude: [
	//     /\.(js|ts|jsx|tsx|json|vue|scss)$/
	// ],

	resolve: {
		//别名
		alias: [
			{ find: '@', replacement: pathResolve('src') },
			{ find: '@api', replacement: pathResolve('src/api') },
			{ find: '@router', replacement: pathResolve('src/router') },
			{ find: '@type', replacement: pathResolve('src/types') },
			{ find: '@components', replacement: pathResolve('src/components') },
			{ find: '@scss', replacement: pathResolve('src/scss') },
			{ find: '@views', replacement: pathResolve('src/views') },
			{ find: '@request', replacement: pathResolve('src/request') },
			{ find: '@utils', replacement: pathResolve('src/utils') },
			{ find: '@assets', replacement: pathResolve('src/assets') },
			{ find: '@stores', replacement: pathResolve('src/stores') },
			{ find: '@use', replacement: pathResolve('src/use') },
			{ find: '@database', replacement: pathResolve('src/database') },
			{ find: '@widgets', replacement: pathResolve('src/widgets') },
		],

		extensions: ['.vue', '.ts', '.js', '.js', '.json', '.tsx', 'jsx'],
	},

	json: {
		//是否支持从json文件中按名导入
		// namedExports: false,
		//为true时，json文件将转为export default JSON.parse('...')，比转成对象字面量性能更好，尤其是json文件比较大时
		//开启后，会禁用namedExports按名导入
		// stringify: true,
	},

	esbuild: {
		minifyWhitespace: true,
		minifyIdentifiers: true,
		minifySyntax: true,
		charset: 'utf8',
		treeShaking: true,
	},

	//插件
	plugins: [
		//.vue文件解析插件
		vue({
			template: {
				compilerOptions: {
					// 将所有带native-的标签名都视为自定义元素
					isCustomElement: (tag) => {
						return tag.startsWith('custom-');
					},
				},
			},
		}),
		//图片导入解析插件
		image(),
		//.md文件解析插件
		// Markdown(),
		//svg图片解析成内联代码
		svgLoader(),
		VueJsx({
			transformOn: true,
		}),
		//pwa
		VitePWA({
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'sw.ts',
			base: '/',
			injectManifest: {
				maximumFileSizeToCacheInBytes: 3000000,
			},
			workbox: {
				cleanupOutdatedCaches: true,
			},
			registerType: 'autoUpdate',
			includeAssets: ['pwa/**.{png,svg}'],
			manifest: {
				name: 'RefrainMusic',
				short_name: 'RefrainMusic',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				icons: [
					{
						src: '/pwa/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/pwa/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
				display: 'standalone',
				description: 'A high appearance level music player based on netease Cloud API!',
			},
		}),
	],

	//优化依赖
	optimizeDeps: {
		esbuildOptions: {
			keepNames: true,
		},
		//强制预构建打包依赖包
		force: true,
		//需要强制预打包的依赖
		// include: [
		// ],
		// exclude: [],
		//vite服务器打开时自动运行pre-bounding预打包
		// auto: true,
	},
	css: {
		devSourcemap: true,
	},
	build: {
		//打包后的代码所支持的运行环境。
		//可选值：es2020（默认值）、es2015（最低值）之类的js版本号；chrome58、safari11之类的浏览器版本号；node12.19.0版本号
		//写法：1、'es2020,chrome58,firefox57,node12.19.0'；2、['es2020', 'chrome58']
		target: 'chrome90',
		//打包后html输出的主目录，默认dist。相对于project root项目根目录确定
		outDir: 'dist/renderer',
		//打包后输出的静态资源目录(包含css、js），默认assets，相对于outDir目录确定
		assetsDir: 'assets',
		//静态资源导入大小限制，默认为4096（4kb）
		assetsInlineLimit: 3072,
		sourcemap: false,
		//rollup配置选项，将会与vite内部的默认配置选项合并
		rollupOptions: {
			watch: {},
			output: {
				manualChunks: manualChunksHandler,
			},
			input: {
				index: pathResolve('index.html'),
			},
		},
		//代码压缩。
		//可选值：true/false——是否允许压缩代码；terser——默认值，压缩体积更小但速度稍慢；esbuild，速度快但体积稍大
		minify: 'terser',
		//build.minify为terser的附加配置选项
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		//css代码分离，默认会在不同异步chunk块加载时插入（即css懒加载），否则所有css背会抽取到一个css文件中
		cssCodeSplit: true,
		//开发插件库时所能用到
		// lib: {}
	},
	//在开发或生产环境下，网页运行的虚拟基础路径
	base: '/',

	//日志记录方式：info（默认）、log、error和silent
	logLevel: 'info',

	//为false时可避免vite清屏而错过在终端中打印某些关键信息
	clearScreen: false,

	server: {
		host: viteConstant.hostname,
		port: viteConstant.port,
		//为true时，若端口已占用则直接退出，而非直接尝试下一个可用端口
		strictPort: false,
		//值为字符串时，会被作为URL的路径名
		open: false,
		cors: true,
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
		//热更新：借助websocket实现
		hmr: {
			overlay: true, //是否覆盖报错，若为false，则不会显示错误提示界面
		},
		fs: {
			strict: false,
		},
	},
	// 自定义网页渲染环境的环境变量前缀，vite默认是VITE_，而electron-vite中默认RENDER_VITE_，这里就统一下
	envPrefix: ['RENDERER_VITE_'],
};

export default defineConfig(() => rendererConfig);
