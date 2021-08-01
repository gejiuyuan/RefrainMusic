import {
  getCurrentInstance,
  markRaw,
  defineComponent,
  shallowRef,
} from "vue";
import MusicList from "@widgets/music-list";
import { getNewExpressMusic } from "@api/music";
import { NewestSongInfo } from "@/types/song";

export default defineComponent({
  name: "MusicHallNewestmusic",
  setup(props, context) {
    // const vm = getCurrentInstance()!;
    const musicList = shallowRef<NewestSongInfo[]>([]);

    const getNewestMusic = async () => {
      const { data } = await getNewExpressMusic({ type: 0 });
      data.forEach((item: any) => {
        item.singer = item.artists.map((_: any) => _.name).join(" / ");
      });
      musicList.value = data;
      // vm.proxy!.$forceUpdate();
    };
    getNewestMusic();

    return () => (
      <div class="music-hall-newestmusic">
        <MusicList
          musiclists={musicList.value}
          category="newest"
        ></MusicList>
      </div>
    );
  },
});
