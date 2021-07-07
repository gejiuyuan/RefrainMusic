import ryoko, { abortPendingRequest } from "ryoko";

export const anfrage = ryoko.create({
  mode: "cors",
  prefixUrl: "/api",
  timeout: 15000,
  cache: "force-cache",
  onDefer(deferMsg) {
    console.info(deferMsg);
  },
  responseType: "json",
});

export const getAll = ryoko.all;
export const getSpread = ryoko.spread;

export const get = ryoko.create({
  mode: "cors",
  timeout: 10000,
  verifyStatus(status) {
    return status >= 200 && status < 400;
  },
  onDefer() {
    console.info(this);
  },
});

get.interceptors.request.use((config) => {
  return config;
});
get.interceptors.response.use((res) => {
  return res;
});

export const getPlaylist = (url: string): Promise<any> =>
  get({ url }).then((res) => {
    return res.data.json();
  });
export const getLyric = (url: string): Promise<any> =>
  get({ url }).then((res) => res.data.text());
export const getPlaybill = (url: string): Promise<any> =>
  get({ url }).then((res) => res.data.url);
