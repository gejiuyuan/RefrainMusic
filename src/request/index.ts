import ryoko, { abortPendingRequest, InterceptorCtor, RyokoResponseType } from "ryoko";
import type { RyokoClass } from 'ryoko';
import { messageBus } from "@/utils/event/register";

export function createRequestInstance(responseType: RyokoResponseType = 'json') {
  const ins = ryoko.create({
    mode: "cors",
    prefixUrl: "/api",
    timeout: 15000,
    cache: "force-cache",
    responseType,
    onDefer(deferMsg) { },
    verifyStatus: (status) => status >= 200 && status < 400,
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

