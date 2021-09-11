import {
  defineComponent,
  watch,
  WatchStopHandle,
  onActivated,
  reactive,
  ref,
} from "vue";
import MusicList from "@widgets/music-list";
import { getNewExpressMusic } from "@api/music";
import { NewestSongInfo } from "@/types/song";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { NRadioButton, NRadioGroup } from "naive-ui";
import './index.scss';

export const NewMusicAreaList = [
  { key: 0, area: '全部', },
  { key: 7, area: '华语', },
  { key: 8, area: '日本', },
  { key: 16, area: '韩国', },
  { key: 96, area: '欧美', },
]

export enum NewMusicAreaMap {
  '全部' = 0,
  '华语' = 7,
  '日本' = 8,
  '韩国' = 16,
  '欧美' = 96,
}

export default defineComponent({
  name: "MusicHallNewestmusic",
  setup(props, context) {
    const defaultAreaKey = NewMusicAreaList[0].key;
    const router = useRouter();
    const route = useRoute();

    const initialMusicListMap = NewMusicAreaList.reduce((data, { key, area }) => {
      data[key as NewMusicAreaMap] = void 0;
      return data;
    }, {} as Record<NewMusicAreaMap, NewestSongInfo[] | undefined>);

    const newestMusicInfo = reactive({
      listMap: initialMusicListMap,
      currentAreaKey: defaultAreaKey as NewMusicAreaMap
    });

    let areaWatcher: WatchStopHandle;

    onActivated(() => {
      areaWatcher = watch(
        () => route.query.area as any, async (areaKey = defaultAreaKey) => {
          newestMusicInfo.currentAreaKey = +areaKey;
          newestMusicInfo.listMap[newestMusicInfo.currentAreaKey] ??= (await getNewExpressMusic({ type: areaKey })).data;
        },
        {
          immediate: true
        }
      );
    })

    onBeforeRouteLeave(() => {
      areaWatcher()
    })

    const areaChange = (areaKey: string | number) => {
      router.push({
        path: route.path,
        query: {
          area: areaKey
        }
      })
    }

    return () => {
      const { currentAreaKey, listMap } = newestMusicInfo;
      const willShowMusicList = listMap[currentAreaKey];
      return (
        <section class="music-hall-newestmusic">
          <section class="newestmusic-layer">
            <NRadioGroup
              value={currentAreaKey}
              onUpdateValue={areaChange}
              size="small"
            >
              {
                NewMusicAreaList.map(item =>
                  <NRadioButton
                    key={item.key}
                    value={item.key}
                  >
                    {item.area}
                  </NRadioButton>
                )
              }
            </NRadioGroup>
          </section>
          <section class="newestmusic-layer">
            {
              willShowMusicList && (
                <MusicList
                  musiclists={willShowMusicList}
                  category="newest"
                ></MusicList>
              )
            }
          </section>
        </section>
      )

    }
  },
});
