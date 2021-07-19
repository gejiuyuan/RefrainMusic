import { toString, isPrototypeOf, isExtensible } from "./constants";

export const typeOf = (ins: any): string =>
  toString.call(ins).slice(8, -1).toLowerCase();

export type Is = PlainObject<(ins: any) => boolean>;
export const is: Is = [
  "string",
  "number",
  "undefined",
  "data",
  "regexp",
  "boolean",
  "null",
].reduce(
  (is, typeStr) => ((is[typeStr] = (ins) => typeOf(ins) === typeStr), is),
  {} as Is
);
is.function = (ins): ins is Function => typeof ins === "function";
is.array = Array.isArray;
is.emptyArray = (ins): ins is Array<any> => is.array(ins) && ins.length === 0;
is.object = (ins): ins is PlainObject<any> =>
  typeof ins === "object" && ins !== null;
is.emptyObject = (ins): ins is PlainObject<any> =>
  is.object(ins) && ins.length === 0;

export const isURL = (url: string) =>
  /(([^:]+:)\/\/(([^:\/\?#]+)(:\d+)?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/.test(url);

//trim去除空格。注：'\uFEFF'即''空字符串
export const trim = function (s: string) {
  return (s || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
};

export const filterUselessKey = (obj: PlainObject<any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === void 0) {
      delete obj[key];
    }
  });
  return obj;
};

export function deepCopy<T extends object>(
  obj: T,
  hash: WeakMap<T, any> = new WeakMap()
): Writeable<T> {
  if (hash.has(obj)) return hash.get(obj);
  const types = [Set, Map, Date, RegExp];
  const Ctor = obj.constructor as any;
  if (types.includes(Ctor)) return new Ctor(obj);
  const attrsDesc = Object.getOwnPropertyDescriptors(obj);
  //如果是不可拓展的（比如为只读属性的），就设为可读
  if (!isExtensible(obj)) {
    for (let i = 0, len = attrsDesc.length.value; i < len; ++i) {
      const curAttrDesc = attrsDesc[i];
      curAttrDesc.configurable = true;
      curAttrDesc.writable = true;
    }
    attrsDesc.length.writable = true;
  }
  const copyObj = Object.create(Object.getPrototypeOf(obj), attrsDesc);
  hash.set(obj, copyObj);
  for (const key of Reflect.ownKeys(copyObj)) {
    const curVal = copyObj[key];
    if (Object(curVal) !== curVal || is.function(curVal)) {
      continue;
    }
    copyObj[key] = deepCopy(curVal, hash);
  }
  return copyObj;
}

//-连接符形式转成小驼峰
export const camelize = (str: string) =>
  str
    .replace(/^[_.\- ]+/, "")
    .toLowerCase()
    .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());

export const merge = (defaults: PlainObject, options: PlainObject) => {
  for (const key in defaults) {
    if (defaults.hasOwnProperty(key)) {
      options[key] === void 0 && (options[key] = defaults[key]);
    }
  }
  return options;
};

export const override = (
  target: PlainObject,
  source: PlainObject
): PlainObject => {
  Object.keys(source).forEach((key) => (target[key] = source[key]));
  return target;
};

//extend
function extendFn(target: PlainObject): PlainObject;
function extendFn(target: PlainObject, source: PlainObject): PlainObject;
function extendFn(target?: PlainObject, source?: PlainObject): PlainObject {
  is.undefined(target) && (target = {});
  is.undefined(source) && (source = {});
  const cloneSource = { ...source };
  const cloneTarget = { ...target };
  Object.keys(cloneSource).forEach((key) => {
    const val = cloneSource[key];
    if (cloneTarget[key] === void 0) {
      cloneTarget[key] = val;
    } else if (is.object(val)) {
      extendFn(cloneTarget[key], val);
    }
  });
  return override(target as PlainObject, cloneTarget);
}
export const extend = extendFn;

export const isAllChinChar = (char: string) => /^[\u4e00-\u9fa5]+$/.test(char);

export const containChinChar = (char: string) =>
  /.*[\u4e00-\u9fa5]+.*/.test(char);

//给字符串的每一位前添加指定内容
export const padStartEveryChar = (str: string, char: string) =>
  str.replace(/(.){1}/g, `${char}$1`);

export const throttle = (fn: (...args: any[]) => any, interval = 1000) => {
  let prev = 0;
  return function (this: any, ...args: any[]) {
    const now = performance.now();
    if (now - prev > interval) {
      fn.apply(this, args);
    } else {
      prev = now;
    }
  };
};

export const fileDownloader = (url: any, filename: string) => {
  return fetch(url)
    .then(
      (res) => res.blob(),
      (err) => false
    )
    .then((blob) => {
      if (!blob) return false;
      const a = document.createElement("a");
      a.download = filename;
      a.hidden = true;
      document.body.appendChild(a);
      const downloadUrl = URL.createObjectURL(blob);
      a.href = downloadUrl;
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      return true;
    });
};

export const objToQuery = (obj: PlainObject<string>, prefix = false) =>
  is.emptyObject(obj)
    ? ""
    : `${prefix ? "?" : ""}${Object.entries(obj)
        .map((arr) => arr.join("="))
        .join("&")}`;

export const padPicCrop = (
  picUrl: string,
  { x, y }: Record<"x" | "y", number>
) => picUrl + `?param=${x}y${y}`;
