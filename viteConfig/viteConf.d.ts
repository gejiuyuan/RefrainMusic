declare type ProxyConfig = {
    [key: string]: {
        target: string;
        changeOrigin: boolean;
        rewrite?: (path: string) => string;
    }
}

declare type ViteConstant = {
    pathResolve: (dir: string) => string;
    merge: (
        options: PlainObject,
        defaults: PlainObject,
    ) => PlainObject;
    hostname: string;
    port: string | number;
    extend: typeof Object.assign;
    proxy: ProxyConfig
}

declare module '@rollup/plugin-image'
