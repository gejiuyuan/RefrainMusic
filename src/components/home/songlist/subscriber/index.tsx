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
import { override } from "@/utils";
import "./index.scss";
import { COMPONENT_NAME, PAGE_SIZE } from "@/utils/preference";

const defaultLimit = PAGE_SIZE[COMPONENT_NAME.SONGLIST_SUBSCRIBER]

export default defineComponent({
  name: COMPONENT_NAME.SONGLIST_SUBSCRIBER,
  setup(props, context) {
    const route = useRoute();
    const vm = getCurrentInstance()!;
    const subscribers = shallowReactive<Subscriber[]>([]);

    const isShowPagi = ref(false);
    const subscriberPagiInfo = shallowReactive<PagiInfo>({
      limit: defaultLimit,
      sizeArr: Array(3)
        .fill(0)
        .map((v, i) => defaultLimit * (i + 1)),
      offset: 0,
      total: 0,
    });

    const getPlaylistSubscribers = async (params: {
      id: number;
      limit: string;
      offset: string;
    }) => {
      const res = await PlaylistSubscribe(params);
      const data = res.data as SubscriberList;
      if (data) {
        subscribers.length = 0;
        subscribers.push(...data.subscribers);
        subscriberPagiInfo.total = data.total;
        isShowPagi.value = data.more && data.reason !== "needLogin";
      }
    };

    watch(
      () => route as any,
      ({ params: { id }, query: { limit, offset } }) => {
        limit = limit || defaultLimit;
        offset = offset || 0;
        subscriberPagiInfo.limit = limit;
        subscriberPagiInfo.offset = offset;
        getPlaylistSubscribers({ limit, id, offset });
      },
      {
        immediate: true,
      }
    );

    const renderNotLogin = () => {
      if (!isShowPagi.value && !subscribers.length) {
        return <div class="need-login">需要登录后才能查看喔~~</div>;
      }
    };

    const renderRoutePagi = () => {
      if (isShowPagi.value) {
        return (
          <RoutePagination pagiInfo={subscriberPagiInfo}></RoutePagination>
        );
      }
    };

    return () => {
      return (
        <section class="songlist-comment">
          {renderNotLogin()}
          <SubscriberListComp userLists={subscribers}></SubscriberListComp>
          {renderRoutePagi()}
        </section>
      );
    };
  },
});
