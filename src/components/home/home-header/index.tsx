import { computed, defineComponent, markRaw, onMounted, reactive, ref, shallowReactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import HeaderSetting from "@/widgets/header-setting";
import Battery from "@/widgets/battery";
import FullScreen from "@/widgets/fullscreen";
import "./index.scss";

import { NMention, NInput, NGrid, NGridItem } from "naive-ui";
import { EMPTY_ARR } from "@/utils";

export default defineComponent({
  name: "HomeHeader",
  setup(props, context) {
    const searchWord = ref("");
    const route = useRoute();
    const router = useRouter();
    const routeBack = () => router.back()
    const routeNext = () => router.forward()

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

    return () => {
      return (
        <>
          <section className="header-left">
            <div
              class="page-turn"
              title="后退"
              onClick={routeBack}
            >
              <i class="iconfont icon-arrowleft"></i>
            </div>

            <div
              class="page-turn"
              title="前进"
              onClick={routeNext}
            >
              <i class="iconfont icon-arrowright"></i>
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
