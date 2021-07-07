import { defineComponent, markRaw, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import HeaderSetting from "@/widgets/header-setting";
import Battery from "@/widgets/battery";
import FullScreen from "@/widgets/fullscreen";
import "./index.scss";

import { NMention, NInput, NGrid, NGridItem } from "naive-ui";

export default defineComponent({
  name: "HomeHeader",
  setup(props, context) {
    const searchWord = ref("");
    const router = useRouter();

    const queryMusic = (
      queryStr: string,
      cb: (param: typeof searchResult) => any
    ) => {
      const result = searchResult;
      cb(result);
    };

    const toPrevPage = () => router.back();
    const toNextPage = () => router.forward();

    const updateSearchValue = (keywords: string) => {
      searchWord.value = keywords;
    };
    const seachChange = () => {
      router.push({
        path: "/search",
        query: {
          keywords: searchWord.value,
        },
      });
    };

    const searchResult = markRaw([
      {
        value: "123",
        label: "dfdd",
      },
    ]);

    return () => {
      return (
        <header class="home-header">
          <NGrid>
            <NGridItem span={8}>
              <NGrid>
                <NGridItem class="page-turn" span={2}>
                  <i class="icon icon-prevpage" title="后退">
                    <svg onClick={toPrevPage} aria-hidden="true">
                      <use xlinkHref="#icon-left"></use>
                    </svg>
                  </i>
                </NGridItem>
                <NGridItem class="page-turn" span={2}>
                  <i class="icon icon-nextpage" title="前进">
                    <svg onClick={toNextPage} aria-hidden="true">
                      <use xlinkHref="#icon-right"></use>
                    </svg>
                  </i>
                </NGridItem>
                <NGridItem span={16}>
                  <NInput
                    class="music-search-input"
                    size="small"
                    onChange={seachChange}
                    onUpdateValue={updateSearchValue}
                    placeholder="搜索音乐、视频、歌词、电台"
                    clearable={true}
                    round={true}
                  ></NInput>
                </NGridItem>
              </NGrid>
            </NGridItem>
            <NGridItem span={4} offset={12}>
              <section class="header-right">
                <Battery></Battery>
                <HeaderSetting></HeaderSetting>
                <FullScreen></FullScreen>
              </section>
            </NGridItem>
          </NGrid>
        </header>
      );
    };
  },
});
