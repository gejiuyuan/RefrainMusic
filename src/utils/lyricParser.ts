import { spliceTime2Second } from "./time";
import { deepCopy, is } from "./common";

export type LrcCommonOrTranslateItem = {
  time: number;
  timeStr: string;
  text: string;
};

export interface LrcItem extends LrcCommonOrTranslateItem {
  translation: string;
}

export interface LyricType {
  lrcArr: LrcItem[];
  commonLrcArr: LrcCommonOrTranslateItem[];
  translationLrcArr: LrcCommonOrTranslateItem[];
  exist: boolean;
  canTranslate: boolean;
}

export interface LyricParserType extends LyricType {
  parse(lrc: string): LrcCommonOrTranslateItem[];
}

export class LyricParser implements LyricParserType {
  static readonly lrcTimeReg = /\[(\d+):(\d+)\.?(\d+)?\]/;

  public exist!: boolean;
  public lrcArr: LrcItem[] = [];
  public translationLrcArr: LrcCommonOrTranslateItem[] = [];
  public commonLrcArr: LrcCommonOrTranslateItem[] = [];
  public canTranslate: boolean = false;

  constructor(lrc: string, transLrc: string = "") {
    this.init(lrc, transLrc);
  }

  init(lrc: string, transLrc: string) {
    //移除掉（）()等括号，因为一些英文歌词存在格式错误
    const bracketReg = /\(|\)|（|）/g;
    this.commonLrcArr = this.parse(lrc.replace(bracketReg, ""));
    this.translationLrcArr = this.parse(transLrc.replace(bracketReg, ""));
    this.exist = this.commonLrcArr.length !== 0;
    this.canTranslate = this.translationLrcArr.length !== 0;
    this.mergeToLrcArr();
    console.info(this);
  }

  mergeToLrcArr() {
    const { commonLrcArr, translationLrcArr } = this;
    const lrcArr: LrcItem[] = [];
    for (let i = 0, { length } = commonLrcArr; i < length; ++i) {
      const { time, text, timeStr } = commonLrcArr[i];
      const translation =
        translationLrcArr.find(({ time: transTime }) => transTime === time)
          ?.text || "";
      lrcArr.push({ time, text, timeStr, translation });
    }
    this.lrcArr = lrcArr;
  }

  parse(lrc: string): LrcCommonOrTranslateItem[] {
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
      if (text.length === 0) {
        continue;
      }
      lyricArr.push({ time, timeStr, text });
    }

    return lyricArr;
  }
}
