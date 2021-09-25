import { BuildOptions } from "vite";

export type ManualChunksFn = UnionToTuple<
  NonNullable<
    NonNullable<BuildOptions['rollupOptions']>['output']
  >
>[0]['manualChunks'];

const chunkNameMapWithUrlKey: PlainObject<string> = {
  // 'naive-ui': 'navie',
  'swiper': 'swiper',
}

const NODE_MODULES = 'node_modules';

const manualChunksHandler: ManualChunksFn = (url, { getModuleIds, getModuleInfo }) => {
  if (!url.includes(NODE_MODULES)) {
    return void 0;
  }
  for (const urlKey in chunkNameMapWithUrlKey) {
    if (url.includes(`${NODE_MODULES}/${urlKey}`)) {
      return chunkNameMapWithUrlKey[urlKey];
    }
  }
}

export default manualChunksHandler;