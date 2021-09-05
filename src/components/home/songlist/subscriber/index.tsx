import {
  toRefs,
  inject,
  shallowReactive,
  watch,
  getCurrentInstance,
  ref,
  defineComponent,
} from "vue";
import {
  useRouter,
  useRoute,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
} from "vue-router";
import SubscriberListComp from "@widgets/subscriber-list";
import RoutePagination, { PagiInfo } from "@widgets/route-pagination";
import { PlaylistSubscribe } from "@api/playlist";
import { Subscriber, SubscriberList } from "@/types/songlist";
import { is, override } from "@/utils";
import "./index.scss";
import { COMPONENT_NAME, PAGE_SIZE } from "@/utils/preference";
import { NEmpty } from "naive-ui";

const defaultLimit = PAGE_SIZE[COMPONENT_NAME.SONGLIST_SUBSCRIBER]

export default defineComponent({
  name: COMPONENT_NAME.SONGLIST_SUBSCRIBER,
  setup(props, context) {
    const route = useRoute();
    const vm = getCurrentInstance()!;
    const subscribers = shallowReactive<Subscriber[]>([]);

    const isShowPagi = ref(false);
    const subscriberPagiInfo = shallowReactive({
      total: 0,
      hasMore: true
    })
    const getPlaylistSubscribers = async (params: {
      id: number;
      limit: string;
      offset: string;
    }) => {
      const { more, total, subscribers: subs, reason } = await PlaylistSubscribe(params);
      subscribers.length = 0;
      subscribers.push(...subs);
      subscriberPagiInfo.total = total;
      subscriberPagiInfo.hasMore = more;
      isShowPagi.value = reason !== "needLogin";
    };

    watch(
      () => route as any,
      ({ params: { id }, query: { limit, offset } }) => {
        limit = limit || defaultLimit;
        offset = offset || 0;
        getPlaylistSubscribers({ limit, id, offset });
      },
      {
        immediate: true,
        deep: true,
      }
    );

    const renderNotLogin = () => {
      if (!isShowPagi.value) {
        return <NEmpty description="亲~~还没有登录噢~~" showDescription={true}></NEmpty>
      }
    };

    return () => {
      const { hasMore, total } = subscriberPagiInfo;
      return (
        <section class="songlist-comment">
          {renderNotLogin()}
          <SubscriberListComp defaultLimit={defaultLimit} userLists={subscribers} hasMore={hasMore} total={total}></SubscriberListComp>
        </section>
      );
    };
  },
});
