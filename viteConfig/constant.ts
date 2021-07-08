import proxyConfig from './proxy';
import path from 'path';
import { merge } from '../src/utils';

const extend = Object.assign
 
const pathResolve = (dir: string) => path.resolve(`${__dirname}`, '../', dir);

const hostname = '0.0.0.0';
const port = 2021;

const viteConstants: ViteConstant = {
    pathResolve,
    merge,
    hostname,
    port,
    extend,
    proxy: proxyConfig
}

export default viteConstants;