interface document {
  documentMode: number;
}

interface Event {
  detail: any;
}

interface Navigator {
  getBattery: () => Promise<any>;
  battery: PlainObject;
  mozBattery: PlainObject;
  webkitBattery: PlainObject;
}

interface window {
  webkitAudioContext: AudioContext;
}

declare type PlainObject<T = any> = Record<string, T>;

declare type Writeable<T> = {
  -readonly [K in keyof T]: T[K];
};

declare type InferFuncParamType<T> = T extends (params: infer P) => any ? P : T;

declare type InferCtorParamTye<T extends new (...args: any[]) => any> =
  T extends new (...args: infer P) => any ? P : never;

declare module "*.css";
declare module "*.scss";
declare module "*.json";
declare module "*.png";
declare module "*.jpg";
declare module "*.webp";
declare module "*.svg";
