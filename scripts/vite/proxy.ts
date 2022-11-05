/** @format */

const proxy: ProxyConfig = {
	'/api': {
		target: 'http://localhost:3000/',
		changeOrigin: true,
		rewrite: (path) => path.replace(/^\/api/, ''),
	},
};

export default proxy;
