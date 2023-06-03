/** @format */

import { ElectronAPI } from '@electron-toolkit/preload';

interface document {
	documentMode: number;
}

interface BeforeInstallPromptEvent extends Event {
	platforms: string[];
	timeStamp: number;
	type: 'beforeinstallprompt';
	prompt: () => void;
	userChoice: Promise<{
		outcome: 'dismissed' | 'accepted' | string;
		platform: string;
	}>;
}

interface WindowEventMap {
	beforeinstallprompt: BeforeInstallPromptEvent;
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
	requestIdleCallback: (cb: CommonFunction, options?: { timeout: number }) => void;
	electron: ElectronAPI;
}

declare type CommonFunction = (...args: any[]) => any;

declare type PlainObject<T = any> = Record<string, T>;

//让数组也继承纯对象特性
interface Array<T> extends PlainObject<T> {}

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

/**
 * UnionToIntersection<{ a: string } | { b: string }> = { a: string } & { b: string }
 */
declare type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (
	x: infer U,
) => any
	? U
	: never;

/**
 * LastUnion<'a' | 'b'> = 'b'
 */
declare type LastUnion<T> = UnionToIntersection<
	T extends any ? (x: T) => any : never
> extends (x: infer L) => any
	? L
	: never;

/**
 * UnionToTuple<'a' | 'b'> = ['a', 'b']
 */
declare type UnionToTuple<T, Last = LastUnion<T>> = [T] extends [never]
	? []
	: [...UnionToTuple<Exclude<T, Last>>, Last];

declare module '*.css';
declare module '*.scss';
declare module '*.json';
declare module '*.png';
declare module '*.jpg';
declare module '*.webp';
declare module '*.svg';

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
