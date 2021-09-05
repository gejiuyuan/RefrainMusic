import { watch, shallowReactive, toRefs, computed, PropType, defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Subscriber } from "@/types/songlist";
import "./index.scss";
import { is, padPicCrop } from "@/utils";
import { NEmpty, NGrid, NGridItem } from "naive-ui";
import RoutePagination, { PagiInfo } from "../route-pagination";
import { PAGE_SIZE } from "@/utils/preference";

export default defineComponent({
  name: "subscriberList",
  props: {
    userLists: {
      type: Array,
      required: true,
    },
    total: {
      type: Number as PropType<number>,
      required: false,
      default: 0,
    },
    defaultLimit: {
      type: Number as PropType<number>,
      required: false,
      default: PAGE_SIZE.DEFAULT,
    },
    gaps: {
      type: Object as PropType<Record<'x' | 'y', number>>,
      required: false,
      default: () => ({ x: 40, y: 40 })
    },
    cols: {
      type: Number as PropType<number>,
      required: false,
      default: 10,
    },
    hasMore: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: true,
    },
  },
  setup(props, { emit, slots }) {
    const route = useRoute();
    const router = useRouter();
    const userItemClick = (item: Subscriber) => {
      router.push({ path: "/user", query: { id: item.userId } });
    };
    const { defaultLimit } = props;
    const subscriberPagiInfo = shallowReactive<PagiInfo>({
      limit: defaultLimit,
      sizeArr: Array(2)
        .fill(0)
        .map((v, i) => defaultLimit * (i + 1)),
      offset: 0,
      total: 0,
    });
    watch(
      () => route as any,
      ({ params: { id }, query: { limit, offset } }) => {
        limit = limit || defaultLimit;
        offset = offset || 0;
        subscriberPagiInfo.limit = limit;
        subscriberPagiInfo.offset = offset;
      },
      {
        immediate: true,
        deep: true,
      }
    );

    return () => {
      const { userLists, gaps: { x, y }, cols, hasMore } = props;
      return (
        <section class="subscriber-list">
          <section class="user-layer">
            <NGrid xGap={x} yGap={y} cols={cols}>
              {
                userLists.map((item: any) => (
                  <NGridItem
                    key={item.id}
                  >
                    <section
                      class="user-item"
                      onClick={() => userItemClick(item)}
                    >
                      <div aspectratio="1">
                        <img
                          loading="lazy"
                          src={padPicCrop(item.avatarUrl, { x: 240, y: 240 })}
                          title={item.nickname}
                        />
                      </div>
                      <div class="user-name" singallinedot title={item.nickname}>
                        {item.nickname}
                      </div>
                    </section>
                  </NGridItem>
                ))
              }
            </NGrid>
          </section>
          {
            !is.emptyArray(userLists) ? (
              <RoutePagination pagiInfo={subscriberPagiInfo} hasMore={hasMore}></RoutePagination>
            ) : (
              <NEmpty description="还没有订阅者噢~~" showDescription={true}></NEmpty>
            )
          }
        </section>
      );
    };
  },
});
