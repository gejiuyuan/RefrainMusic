/** @format */

import { is } from '../common';

export interface EventFun {
	(...args: any[]): any;
}

export interface EventFunOnce extends EventFun {
	source: EventFun;
}

export type EventStore = PlainObject<(EventFun | EventFunOnce)[]>;

interface EventDispatcherClass
	extends Record<
		'on' | 'off' | 'once' | 'dispatch',
		(type: string, cb: EventFun) => void
	> {}

export default class EventDispatcher implements EventDispatcherClass {
	public store: EventStore = {};

	constructor(public name: string) {
		this.name = name;
	}

	on(type: string, cb: EventFun | EventFunOnce) {
		if (!is.function(cb)) {
			throw new TypeError(`The parameter of 'on' must be a function`);
		}

		const { store } = this;
		const targetStore = store[type];

		if (is.undefined(targetStore)) {
			store[type] = [cb];
			return;
		}

		!targetStore.includes(cb) && targetStore.push(cb);
	}

	off(type: string, cb: EventFun) {
		if (!is.function(cb)) {
			throw new TypeError(`The parameter of 'on' must be a function`);
		}

		const { store } = this;
		const targetStore = store[type];

		if (is.emptyArray(targetStore) || is.undefined(targetStore)) {
			return;
		}

		store[type] = targetStore.filter(
			(callback) => callback !== cb || (callback as EventFunOnce).source !== cb,
		);
	}

	once(type: string, cb: EventFun) {
		if (!is.function(cb)) {
			throw new TypeError(`The parameter of 'on' must be a function`);
		}

		const once: EventFunOnce = () => {
			cb.apply(this);
			this.off(type, once);
		};
		once.source = cb;

		this.on(type, once);
	}

	dispatch(type: string, ...args: any[]) {
		const { store } = this;
		const targetStore = store[type];

		if (is.emptyArray(targetStore) || is.undefined(targetStore)) {
			return;
		}
		targetStore.forEach((cb) => cb.apply(this, args));
	}
}
