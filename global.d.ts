type PlainObject2 = Record<string, any>

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
  -readonly [K in keyof T]: T[K]
}

declare module "*.css";
declare module "*.scss";
declare module "*.json";
declare module "*.png";
declare module "*.jpg";
declare module "*.webp";
declare module "*.svg";
 