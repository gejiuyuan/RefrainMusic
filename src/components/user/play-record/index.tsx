import {
  toRefs,
  watch,
  ref,
  Ref,
  computed,
  inject,
  defineComponent,
} from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import MusicList from "@/widgets/music-list";

import { PlayRecord } from "@/types/song";
import { defaultPlayRecordType, playRecordTimeRange } from "../config";
import "./index.scss";
import {
  ChatWarning24Regular
} from '@vicons/fluent';
import { NRadio, NRadioButton, NRadioGroup, NSpace, NIcon, } from "naive-ui";

export default defineComponent({
  name: "PlayRecord",
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();

    const playlist = inject<PlayRecord>("playRecordData")!;
    const userInfo = inject<Ref<any>>("userInfo")!;

    const musiclist = computed(() => playlist.map(({ song }) => song));

    const curPlayRecordRange = ref(1);

    const playRecordRangeChange = (typeVal: number | string) => {
      router.push({
        path: route.path,
        query: { ...route.query, type: typeVal },
      });
    };

    watch(
      () => route.query.type as string | number,
      (curType) => {
        curType = +curType;
        const isExsit = playRecordTimeRange.some(
          ({ type }) => curType === type
        );
        curPlayRecordRange.value = isExsit ? curType : defaultPlayRecordType;
      },
      {
        immediate: true,
      }
    );

    return () => {
      const { listenSongs, peopleCanSeeMyPlayRecord, profile } = userInfo.value;
      return (
        <section class="user-play-record">
          <section class="play-record-header">
            <div class="record-desc">
              <NIcon class="record-icon-info" color={'#0e7a0d'}>
                <ChatWarning24Regular></ChatWarning24Regular>
              </NIcon>
              最近累计听歌
              <span>{listenSongs}</span>首
            </div>
            {
              peopleCanSeeMyPlayRecord && (
                <div class="record-type">
                  <NRadioGroup
                    value={curPlayRecordRange.value}
                    onUpdateValue={playRecordRangeChange}
                  >
                    <NSpace>
                      {
                        playRecordTimeRange.map((item, i) => (
                          <NRadio value={item.type} key={item.text}>
                            {item.text}
                          </NRadio>
                        ))
                      }
                    </NSpace>
                  </NRadioGroup>
                </div>
              )
            }
          </section>

          {
            peopleCanSeeMyPlayRecord
              ? (
                <MusicList musiclists={musiclist.value} cols={4}></MusicList>
              )
              : (
                <p class="canNotSee">
                  <span>{profile?.nickname}</span>
                  没有开放播放记录查看权限喔~~
                </p>
              )
          }
        </section>
      );
    };
  },
});
