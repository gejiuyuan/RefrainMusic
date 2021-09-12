import ryoko, { abortPendingRequest, InterceptorCtor, RyokoResponseType } from "ryoko";
import type { RyokoClass } from 'ryoko';
import { messageBus } from "@/utils/event/register";
import { nextTick } from "vue";

export function createRequestInstance(responseType: RyokoResponseType = 'json') {
  const ins = ryoko.create({
    mode: 'cors',
    prefixUrl: import.meta.env.VITE_APP_PREFIX_URL as string,
    timeout: 15000,
    cache: "force-cache",
    responseType,
    onDefer(deferMsg) { },
    verifyStatus: (status) => status >= 200 && status < 500,
  });
  ins.interceptors.request.use((config) => {
    if (!import.meta.env.DEV) {
      config.params ??= {};
      Reflect.set(config.params as PlainObject, 'realIP', '116.25.146.177');
    }
    return config;
  }, (err) => {
    throw err;
  });
  ins.interceptors.response.use((res) => res.data, (err: any) => {
    console.info(err.message, '请求出错啦~~')
  });
  return ins;
}

export const anfrage = createRequestInstance();


export const anfrageWithLoading = createRequestInstance();
useLoadingMixin(anfrageWithLoading.interceptors);

let requestCount = 0;
let isLoadingFailure = false;
function useLoadingMixin(interceptors: RyokoClass['interceptors']) {
  interceptors.request.use(config => {
    if (requestCount === 0) {
      messageBus.dispatch('startLoading');
    }
    requestCount++;
    return config;
  });

  const handleResLoadingClose = async () => {
    if (--requestCount === 0) {
      await nextTick();
      messageBus.dispatch(isLoadingFailure ? 'errorLoading' : 'finishLoading');
      isLoadingFailure = false;
    }
  }

  interceptors.response.use(async resData => {
    await handleResLoadingClose();
    return resData;
  }, async err => {
    isLoadingFailure = true;
    await handleResLoadingClose();
    throw err;
  })
}

