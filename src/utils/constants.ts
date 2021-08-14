import { getCountryCode } from "@api/other";

export const NOOP = function (a?: any, b?: any, c?: any) { };

export const EMPTY_OBJ = Object.create(null);

export const EMPTY_ARR = [];

export const { toString, isPrototypeOf, hasOwnProperty } = Object.prototype;

export const { freeze, seal, preventExtensions, isExtensible, } = Object;

export const UNICODE_CHAR = {
    smile: `\u{1F60A}`,
    pensive: `\u{1F614}`,
    hugface: `\u{1F917}`,
    registed: `\u{00AE}`,
};

export const phoneVerifyPatt = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[01356789]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|6[567]\d{2}|4(?:[14]0\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/;

//国家编号(用于电话号码前缀)
export const countryCodes = (async () => {
    const { data = EMPTY_OBJ } = await getCountryCode();
    return data;
})();