export const NOOP = function (a?: any, b?: any, c?: any) {};

export const EMPTY_OBJ = Object.create(null);

export const EMPTY_ARR = [];

export const { toString, isPrototypeOf } = Object.prototype;

export const { freeze, seal, preventExtensions , isExtensible } = Object;
