import proxyConfig from './proxy';
import path from 'path'; 

const extend = Object.assign
 
const pathResolve = (dir: string) => path.resolve(`${__dirname}`, '../', dir);

const hostname = '127.0.0.1';
const port = 2021;

const viteConstants: ViteConstant = {
    pathResolve, 
    hostname,
    port,
    extend,
    proxy: proxyConfig
}

export default viteConstants;