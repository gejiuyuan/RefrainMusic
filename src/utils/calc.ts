import {
    is
} from './common';

export const getRanInteger = (min: number, max: number) =>
    ~~(Math.random() * (max - min + 1) + min);

export const getRanDigit = (min: number, max: number) =>
    Math.random() * (max - min) + min;

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
