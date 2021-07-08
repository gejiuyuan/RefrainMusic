export const NOOP = function (a?: any, b?: any, c?: any) { };

export const EMPTY_OBJ = Object.create(null);

export const EMPTY_ARR = [];

export const { toString, isPrototypeOf } = Object.prototype;

export const { freeze, seal, preventExtensions, isExtensible } = Object;

export const UNICODE_CHAR = {
    smile: `\u{1F60A}`,
    pensive: `\u{1F614}`,
    hugface: `\u{1F917}`,
};