import { spliceTime2Second } from "./time";
import { deepCopy, is } from "./common";

export type LrcItem = {
  time: number;
  timeStr: string;
  text: string;
  translation?: string;
};

export interface LyricType {
  lrcArr: LrcItem[];
  commonLrcArr: LrcItem[];
  translationLrcArr: LrcItem[];
  exist: boolean;
  canTranslate: boolean;
}

export interface LyricParserType extends LyricType {
  parse(lrc: string): LrcItem[];
}

export class LyricParser implements LyricParserType {
  static readonly lrcTimeReg = /\[(\d+):(\d+)\.?(\d+)?\]/;

  public exist!: boolean;
  public lrcArr: LrcItem[] = [];
  public translationLrcArr: LrcItem[] = [];
  public commonLrcArr: LrcItem[] = [];
  public canTranslate: boolean = false;

  constructor(lrc: string, transLrc: string = "") {
    this.init(lrc, transLrc);
  }

  init(lrc: string, transLrc: string) {
    const exist = lrc.length !== 0;
    const canTranslate = transLrc.length !== 0;
    this.exist = exist;
    this.canTranslate = canTranslate;
    //移除掉（）()等括号，因为一些英文歌词存在格式错误
    const bracketReg = /\(|\)|（|）/g;
    exist && (this.commonLrcArr = this.parse(lrc.replace(bracketReg, "")));
    canTranslate &&
      (this.translationLrcArr = this.parse(transLrc.replace(bracketReg, "")));
    this.mergeToLrcArr();
  }

  mergeToLrcArr() {
    const { commonLrcArr, translationLrcArr } = this;
    const lrcArr = deepCopy(commonLrcArr);
    if (![commonLrcArr, translationLrcArr].some(is.emptyArray)) {
      const firstTranslateTime = translationLrcArr[0].time;
      const canStartTranslateIdx = commonLrcArr.findIndex(
        ({ time }) => time === firstTranslateTime
      );
      if (~canStartTranslateIdx) {
        let idx = canStartTranslateIdx;
        const { length } = lrcArr;
        while (idx < length) {
          lrcArr[idx].translation =
            translationLrcArr[idx - canStartTranslateIdx].text;
          ++idx;
        }
      }
    }
    this.lrcArr = lrcArr;
  }

  parse(lrc: string): LrcItem[] {
    const lyricArr = [];
    const lrcSplitArr = lrc.split("\n");
    const { length } = lrcSplitArr;
    const { lrcTimeReg } = LyricParser;

    for (let i = 0; i < length; i++) {
      const lrcStr = lrcSplitArr[i];
      const timePatt = lrcTimeReg.exec(lrcStr);
      if (timePatt === null) {
        continue;
      }
      const timeText = timePatt[0];
      const timeStr = timeText.slice(1, -1);
      const time = +spliceTime2Second
        .apply(null, [timePatt[3], timePatt[2], timePatt[1]])
        .toFixed(3);

      const text = lrcStr.replace(timeText, "").trim();
      //由于接口返回数据存在某些没有翻译的情况，因而删除此处判断逻辑
      // if (text.length === 0) {
      //   continue;
      // }
      lyricArr.push({ time, timeStr, text });
    }

    return lyricArr;
  }
}
