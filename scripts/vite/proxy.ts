const proxy: ProxyConfig = {
    '/api': {
        target: 'http://localhost:1008/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
    },
  
}

export default proxy;
