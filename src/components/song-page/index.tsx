import { getMusicComment } from "@/api/music";
import { onFilteredBeforeRouteUpdate } from "@/hooks/onRouteHook";
import { SongComment } from "@/types/song";
import { objToPathname } from "@/utils";
import { renderKeepAliveRouterView } from "@/widgets/common-renderer";
import CommonRouterList from "@/widgets/common-router-list";
import { defineComponent, provide, reactive, ref, shallowReactive } from "vue";
import { RouteParams, useRouter } from "vue-router";
import './index.scss';

const songPageTemplateRouteList = [
  {
    to: '/song/:id/comment',
    text: '评论'
  }
]

export default defineComponent({
  name: "SongPage",
  setup() {

    const router = useRouter();
    const songPageRouteList = shallowReactive<typeof songPageTemplateRouteList>([]);

    const songCommentDataRef = ref<SongComment>({
      total: 0,
      moreHot: false,
      more: false,
      userId: 0,
      isMusician: false,
      commentBanner: null,
      comments: [],
      hotComments: [],
      topComments: []
    });
    provide('commentData', songCommentDataRef);
    
    const syncRelativeData = () => {
      updatePageRouteList();
      getCommentDate();
    }

    const getCommentDate = async () => {
      const { params } = router.currentRoute.value;
      const data = await getMusicComment({
        id: params.id as string,
      });
      songCommentDataRef.value = data;
    }

    /**
     * 更新RouteList路由导航数据
     */
    const updatePageRouteList = () => {
      const { params } = router.currentRoute.value;
      songPageTemplateRouteList.forEach(({ text, to }, i) => {
        songPageRouteList[i] = {
          text,
          to: to.replace(':id', objToPathname(params, false)),
        };
      });
    }

    syncRelativeData();
    onFilteredBeforeRouteUpdate((to, from) => {
      const { id: toId } = to.params;
      const { id: fromId } = from.params;
      if (toId != fromId) {
        syncRelativeData();
      }
    });

    return () => {
      return (
        <section id="song-detail-page">
          <CommonRouterList routelist={songPageRouteList}></CommonRouterList>
          {
            renderKeepAliveRouterView()
          }
        </section>
      )
    }
  }
})