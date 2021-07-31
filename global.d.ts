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
  requestIdleCallback: (cb: Function, options?: { timeout: number }) => void;
}

declare type PlainObject<T = any> = Record<string, T>;

declare type Writeable<T> = {
  -readonly [K in keyof T]: T[K];
};

declare type FuncParamsType<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : T;

declare type CtorParamsType<T extends abstract new (...args: any[]) => any> =
  T extends new (...args: infer P) => any ? P : never;

declare module "*.css";
declare module "*.scss";
declare module "*.json";
declare module "*.png";
declare module "*.jpg";
declare module "*.webp";
declare module "*.svg";

// declare module "colorthief" {
//   class ColorThief {
//     getColor: (
//       src: HTMLOrSVGImageElement,
//       quality?: number
//     ) => [number, number, number];
//     getPalette: (
//       src: HTMLOrSVGImageElement,
//       colorCount?: number,
//       quality?: number
//     ) => Array<[number, number, number]>;
//   }
//   export default ColorThief;
// }
