import { PlayerState } from "./player";
type StateFn = () => PlayerState;

const state: StateFn = () => ({
  title: "小果音乐",
  volume: 0.5,
  paused: false,
  loop: false,
  playOrder: "random", // singalLoop random loop order
  canUpdateTime: true,
  willPlayTime: 0,
  currentTime: 0,
  currentDuration: 0,
  currentIndex: 1,
  lyric: {
    data: [],
    canTranslate: false,
    exsit: false,
  },
  playlist: {
    isShow: false,
    list: [],
    history: [],
    length: 0,
  },
  playbill: {
    src: "",
    size: [360, 360],
  },
});

export default state;
