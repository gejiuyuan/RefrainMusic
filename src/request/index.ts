import ryoko, { abortPendingRequest } from "ryoko";

export const anfrage = ryoko.create({
  mode: "cors",
  prefixUrl: "/api",
  timeout: 15000,
  cache: "force-cache",
  onDefer(deferMsg) {
    console.info(deferMsg);
  },
  verifyStatus(status) {
    return status >= 200 && status < 400;
  },
  responseType: "json",
});

anfrage.interceptors.request.use((config) => {
  return config
}, err => {
  return err
})

anfrage.interceptors.response.use((res: any) => {
  return res
}, err => {
  console.dir(err)
  return err
})

export const getAll = ryoko.all;
export const getSpread = ryoko.spread;

