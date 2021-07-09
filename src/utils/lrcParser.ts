import { spliceTime2Second } from "./time";
import { is } from "./common";

export type LrcItem = {
  time: number;
  timeStr: string;
  text: string;
  translation?: string;
};

export interface LyricType {
  data: LrcItem[];
  canTranslate: boolean;
  exsit: boolean;
}

export interface LyricClassType extends LyricType {
  parse(lrc: string): LrcItem[];
}

export class LyricParser implements LyricClassType {
  static lrcTimeReg = /\[(\d+):(\d+)\.?(\d+)?\]/;
  static lrcTranslateReg = /(.+)(\((.+)\))/;

  public data!: LrcItem[];
  public canTranslate!: boolean;
  public exsit!: boolean;

  constructor(lrc: string) {
    this.init(lrc);
  }

  init(lrc: string) {
    this.data = lrc.length !== 0 ? this.parse(lrc) : [];
    this.exsit = this.data.length !== 0;
    this.canTranslate =
      this.data.filter((item) => !is.undefined(item.translation)).length >=
      this.data.length / 4;
  }

  parse(lrc: string) {
    const lyricArr = [];
    const lrcSplitArr = lrc.split("\n");
    const len = lrcSplitArr.length;
    const lrcTimeReg = LyricParser.lrcTimeReg;
    const lrcTranslateReg = LyricParser.lrcTranslateReg;

    for (let i = 0; i < len; i++) {
      const lrcStr = lrcSplitArr[i];
      const timePatt = lrcTimeReg.exec(lrcStr);

      if (timePatt === null) continue;

      const timeText = timePatt[0];
      const timeStr = timeText.slice(1, -1);
      const time = +spliceTime2Second
        .apply(null, [timePatt[3], timePatt[2], timePatt[1]])
        .toFixed(3);

      let text = lrcStr.replace(timeText, "").trim();
      if (text.length === 0) continue;

      const translatePatt = lrcTranslateReg.exec(text);
      const lrcItem = { time, timeStr } as LrcItem;

      // 判断是否支持译文
      if (!is.null(translatePatt)) {
        const patt = translatePatt as RegExpExecArray;
        text = text.replace(patt[2], "").trim();
        lrcItem.translation = patt[3];
      }
      lrcItem.text = text;

      lyricArr.push(lrcItem);
    }

    return lyricArr;
  }
}
