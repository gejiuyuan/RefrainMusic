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
    const searchChange = () => {
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
        <>
          <section className="header-left">
            <div class="page-turn">
              <i
                class="iconfont icon-arrowleft"
                title="后退"
                onClick={toPrevPage}
              ></i>
            </div>

            <div class="page-turn">
              <i
                class="iconfont icon-arrowright"
                title="前进"
                onClick={toNextPage}
              ></i>
            </div>

            <NInput
              class="music-search-input"
              size="small"
              onChange={searchChange}
              onUpdateValue={updateSearchValue}
              placeholder="搜索音乐、视频、歌词、电台"
              clearable={true}
              round={true}
            ></NInput>
          </section>

          <section class="header-right">
            <Battery></Battery>
            <HeaderSetting></HeaderSetting>
            <FullScreen></FullScreen>
          </section>
        </>
      );
    };
  },
});
