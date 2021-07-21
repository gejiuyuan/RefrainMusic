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

//是否是标准格式时间（如2020-12-20）
export const isStandardD = (
  d: string,
  connector: "-" | "." | "/" | " " | "\0" = "-"
): boolean =>
  new RegExp(
    String.raw`^\d{4}${connector}\d{1,2}${connector}\d{1,2}$`,
    "g"
  ).test(d);

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
): Record<"hour" | "minute" | "second", number> => {
  const splits = timeStr.split(":").map((_) => +_);
  const { length } = splits;
  const obj = {};
  if (length <= 2) {
    splits.unshift(0);
  }
  return {
    hour: splits[0],
    minute: splits[1],
    second: splits[2],
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
