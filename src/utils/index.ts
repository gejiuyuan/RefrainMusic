import { toString, isPrototypeOf, isExtensible } from "./constant";

export const typeOf = (ins: any): string =>
  toString.call(ins).slice(8, -1).toLowerCase();

export const is: PlainObject<(ins: any) => boolean> = [
  "string",
  "number",
  "undefined",
  "data",
  "regexp",
  "boolean",
  "null",
].reduce((is, typeStr) => {
  is[typeStr] = (ins) => typeOf(ins) === typeStr;
  return is;
}, {} as PlainObject<(ins: any) => boolean>);

is.function = (ins) => typeof ins === "function";
is.array = Array.isArray;
is.emptyArray = (ins) => is.array(ins) && ins.length === 0;
is.object = (ins) => typeof ins === "object" && ins !== null;
is.emptyObject = (ins) => is.object(ins) && ins.length === 0;

//是否是标准格式时间（如2020-12-20）
export const isStandardD = (
  d: string,
  connector: "-" | "." | "/" | " " | "\0" = "-"
): boolean =>
  new RegExp(
    String.raw`^\d{4}${connector}\d{1,2}${connector}\d{1,2}$`,
    "g"
  ).test(d);

//trim去除空格。注：'\uFEFF'即''空字符串
export const trim = function (s: string) {
  return (s || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
};

export const toStandardTime = (content: string | number): string => {
  const time = new Date(+content);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  return [year, month, day].join("-");
};

export const filterDate = (content: string | number): string => {
  content = String(content);
  return isStandardD(content) ? content : toStandardTime(content);
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
    for (
      let i = 0, len = attrsDesc.length.value;
      i < len;
      ++i
    ) {
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
    if (
      Object(curVal) !== curVal ||
      is.function(curVal)
    ) {
      continue;
    }
    copyObj[key] = deepCopy(curVal, hash);
  }
  return copyObj;
}

//-连接符形式转成小驼峰
export const camelize = (str: string): string =>
  str
    .replace(/^[_.\- ]+/, "")
    .toLowerCase()
    .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());

//给字符串的每一位前添加指定内容
export const padStartEveryChar = (str: string, char: string) =>
  str.replace(/(.){1}/g, `${char}$1`);

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

//noop
export const noop = function (a?: any, b?: any, c?: any) { };

// 音视频时间解析
export const spliceTime2Second = (
  ms: number | string,
  s: number | string,
  m: number | string,
  h: number | string = 0
) => +ms / 1000 + +s + +m * 60 + +h * 60 * 60;

export const timeStr2Second = (timeStr: string): number => {
  const timeobj = parseTimeStr(timeStr);
  const values = Object.values(timeobj).reverse();
  const h2s = values.length === 3 ? values[2] * 60 * 60 : 0;
  return values[0] + values[1] * 60 + h2s;
};

export const second2Time = (second: number | string) => {
  second = +second;
  const day = ~~(second / (24 * 60 * 60));
  const hour = ~~((second / (60 * 60)) % 24);
  const minute = ~~((second / 60) % 60);
  const restSecond = ~~(second % 60);
  return {
    day,
    hour,
    minute,
    restSecond,
  };
};

export const msSecondToTimeStr = (
  msSecond: number | string,
  separator = ":",
  boundKey: "day" | "hour" | "minute" = "minute"
) => second2TimeStr(+msSecond / 1000, separator, boundKey);

export const second2TimeStr = (
  second: number | string,
  separator = ":",
  boundKey: "day" | "hour" | "minute" = "minute"
) => {
  if (!["day", "hour", "minute"].includes(boundKey)) {
    throw new TypeError(
      `the 'boundKey' must be one of the three options: 'day'、'hour'、'minute'`
    );
  }
  const timeMap = second2Time(second);
  const timeArr = Object.values(timeMap);
  const realTimeStr = timeArr
    .slice(Object.keys(timeMap).indexOf(boundKey))
    .map((val) => (val < 10 ? `0${val}` : String(val)))
    .join(separator);
  return realTimeStr;
};

export const parseTimeStr = (
  timeStr: string
):
  | {
    hour?: number;
    minute: number;
    second: number;
  }
  | never => {
  const splits = timeStr.split(":").map((_) => +_);
  const len = splits.length;
  if (len === 3) {
    return {
      hour: splits[0],
      minute: splits[1],
      second: splits[2],
    };
  }
  if (len === 2) {
    return {
      minute: splits[0],
      second: splits[1],
    };
  }
  throw new TypeError(`the format of time string is illegal !`);
};

export const getRanInteger = (min: number, max: number) =>
  ~~(Math.random() * (max - min + 1) + min);
export const getRanDigit = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const isAllChinChar = (char: string) => /^[\u4e00-\u9fa5]+$/.test(char);
export const containChinChar = (char: string) =>
  /.*[\u4e00-\u9fa5]+.*/.test(char);

export const decimalToPercent = (decimal: number, fixed = 0, sign = true) => {
  if (!is.number(+decimal)) {
    throw new TypeError(`the ${decimal} is an invalid parameter`);
  }
  return `${(decimal * 100).toFixed(fixed)}${sign ? "%" : ""}`;
};

export const percentToDecimal = (percent: string | number) => {
  percent = String(percent).trim();
  const percentPatt = percent.match(/(%)$/);
  !is.null(percentPatt) &&
    (percent = percent.replace((percentPatt as RegExpMatchArray)[1], ""));
  return +percent / 100;
};

export const rmDemicalInPercent = (percent: string) =>
  percent.replace(/\.\d*/, "");

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

export const closest = (
  ele: Element,
  tar: Element | ArrayLike<Element> | string
): Element | null | never => {
  //不写Element.prototype.isPrototypeOf(ele)原因见：
  // http://eslint.cn/docs/rules/no-prototype-builtins

  if (!isPrototypeOf.call(Element.prototype, ele)) {
    throw new TypeError(`${ele} is not a Element!`);
  }

  const elArr = (() => {
    if (tar instanceof Element) {
      return [tar];
    }
    try {
      tar = document.querySelectorAll(tar as string);
    } finally {
      const tarTypeOptions = ["nodelist", "htmlcollection", "array"];
      if (tarTypeOptions.includes(typeOf(tar))) {
        return Array.from(tar as ArrayLike<Element>);
      }
      return [];
    }
  })();
  do {
    if (elArr.includes(ele)) return ele;
    ele = ele.parentNode as Element;
  } while (ele !== null);

  return null;
};

//获取元素宽高、以及距离页面边缘的距离
export const getElmRectInfo = (el: Element | null): PlainObject => {
  if (!(el instanceof Element)) {
    throw new TypeError(`${el} is not a Element!`);
  }

  const elm = el as Element;
  if (!elm.getClientRects().length) {
    return { left: 0, top: 0, width: 0, height: 0 };
  }
  const elmRectInfo = elm.getBoundingClientRect();
  const win = elm.ownerDocument.defaultView as typeof globalThis;
  return {
    left: elmRectInfo.left + win.pageXOffset,
    top: elmRectInfo.top + win.pageYOffset,
    width: elmRectInfo.width,
    height: elmRectInfo.height,
  };
};

export const computedStyle = (
  el: Element,
  attr: string,
  pseudo: string | null = null
) =>
  (el.ownerDocument.defaultView as typeof globalThis)
    .getComputedStyle(el, pseudo)
    .getPropertyValue(attr);

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

export const getLocaleCount = (count: number, fixed = 2) => {
  const arr = [
    { key: "亿", digit: 8 },
    { key: "万", digit: 4 },
    // { key: '千', digit: 3 },
    // { key: '百', digit: 2 },
  ];
  for (const { key, digit } of arr) {
    const val = count / +`1${"0".repeat(digit)}`;
    if (val >= 1) {
      return val.toFixed(fixed) + key;
    }
  }
  return String(count);
};

export const getDate = (time: number) => {
  const date = time == void 0 ? new Date() : new Date(time);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
};

export const localeDateKeyMaps: PlainObject<string> = {
  year: "年",
  month: "月",
  day: "日",
  hour: "时",
  minute: "分",
  second: "秒",
  milliSecond: "毫秒",
};

export const padSingalDigit = (val: string | number) =>
  `${+val < 10 ? "0" : ""}${val}`;

export const getLocaleDate = (
  time: number,
  factor: {
    showZero?: boolean;
    divide?: string;
    delimiter?: string;
  } = {}
) => {
  const { showZero, divide, delimiter } = factor;
  let dateEntries = Object.entries(getDate(time));
  !showZero && (dateEntries = dateEntries.filter((arr) => arr[1]));
  if (divide) {
    const tarIdx = dateEntries.findIndex((_) => _[0] === divide);
    ~tarIdx && (dateEntries = dateEntries.slice(0, tarIdx + 1));
  }

  return delimiter != void 0
    ? dateEntries.map((arr) => padSingalDigit(arr[1])).join(delimiter)
    : dateEntries
      .map(([key, val]) => padSingalDigit(val) + localeDateKeyMaps[key])
      .join("");
};

export const objToQuery = (obj: PlainObject<string>, prefix = false) =>
  is.emptyObject(obj)
    ? ""
    : `${prefix ? "?" : ""}${Object.entries(obj)
      .map((arr) => arr.join("="))
      .join("&")}`;

export const padPicCrop = (
  picUrl: string,
  {
    x,
    y,
  }: {
    x: number;
    y: number;
  }
) => picUrl + `?param=${x}y${y}`;
