import { watch, shallowReactive, toRefs, computed, PropType, defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Subscriber } from "@/types/songlist";
import "./index.scss";
import { padPicCrop } from "@/utils";
import { NGrid, NGridItem } from "naive-ui";

export default defineComponent({
  name: "subscriberList",
  props: {
    userLists: {
      type: Array,
      required: true,
    },
    gaps: {
      type: Object as PropType<Record<'x' | 'y', number>>,
      required: false,
      default: () => ({ x: 30, y: 30 })
    },
    cols: {
      type: Number as PropType<number>,
      required: false,
      default: 11,
    },
  },
  setup(props, { emit, slots }) {
    const router = useRouter();
    const userItemClick = (item: Subscriber) => {
      router.push({ path: "/user", query: { id: item.userId } });
    };
    return () => {
      const { userLists, gaps: { x, y }, cols } = props;
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
                      <div equalAspectRatio>
                        <img
                          loading="lazy"
                          src={padPicCrop(item.avatarUrl, { x: 240, y: 240 })}
                          title={item.nickname}
                        />
                      </div>
                      <div class="user-name" singalLineDot title={item.nickname}>
                        {item.nickname}
                      </div>
                    </section>
                  </NGridItem>
                ))
              }
            </NGrid>
          </section>
        </section>
      );
    };
  },
});
