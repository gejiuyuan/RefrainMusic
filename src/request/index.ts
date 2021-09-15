import ryoko, { abortPendingRequest, InterceptorCtor, RyokoResponseType } from "ryoko";
import type { RyokoClass } from 'ryoko';
import { messageBus } from "@/utils/event/register";
import { loginCookie } from "@/utils/auth";

export function createRequestInstance(responseType: RyokoResponseType = 'json') {
  const ins = ryoko.create({
    mode: 'cors',
    prefixUrl: import.meta.env.VITE_APP_PREFIX_URL as string,
    timeout: 15000,
    cache: "force-cache",
    responseType,
    params: import.meta.env.DEV ? {} : { realIP: '116.25.146.177' },
    onDefer(deferMsg) { },
    verifyStatus: (status) => status >= 200 && status < 500,
  });
  ins.interceptors.request.use((config) => {
    const MUSIC_C_COOKIE = loginCookie.value;
    if (MUSIC_C_COOKIE) {
      config.params ??= Object.create(null);
      Reflect.set(config.params as PlainObject, 'cookie', MUSIC_C_COOKIE)
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

  const handleResLoadingClose = () => {
    if (--requestCount === 0) {
      messageBus.dispatch(isLoadingFailure ? 'errorLoading' : 'finishLoading');
      isLoadingFailure = false;
    }
  }

  interceptors.response.use(resData => {
    handleResLoadingClose();
    return resData;
  }, err => {
    isLoadingFailure = true;
    handleResLoadingClose();
    throw err;
  })
}

