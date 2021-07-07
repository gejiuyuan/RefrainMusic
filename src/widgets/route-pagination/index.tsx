import { NPagination } from "naive-ui";
import { computed, toRefs, defineComponent, Ref, PropType } from "vue";
import { useRouter, useRoute } from "vue-router";
import "./index.scss";

export type PagiInfo = {
  offset: number | string;
  sizeArr: number[];
  limit: number | string;
  total?: number | string;
};

export default defineComponent({
  name: "RoutePagination",
  props: {
    pagiInfo: {
      type: Object as PropType<PagiInfo>,
      required: true,
    },
  },
  setup(props, { emit, slots }) {
    const router = useRouter();
    const route = useRoute();

    const layoutInfo = computed(() => {
      const total = props.pagiInfo.total;
      return [
        total && "total",
        "sizes",
        "prev",
        total && "pager",
        "next",
        "jumper",
      ]
        .filter((_) => _)
        .join(",");
    });

    const handleSizeChange = (curSize: number) =>
      router.push({
        query: {
          ...route.query,
          limit: curSize,
        },
      });

    const handleCurrentChange = (curPage: number) => {
      router.push({
        query: {
          ...route.query,
          offset: curPage - 1,
        },
      });
    };

    return () => {
      const paginationInfo = props.pagiInfo;
      return (
        <section class="yplayer-route-pagination">
          <el-pagination
            onSizeChange={handleSizeChange}
            onCurrentChange={handleCurrentChange}
            currentPage={+paginationInfo.offset + 1}
            pageSizes={paginationInfo.sizeArr}
            pageSize={+paginationInfo.limit}
            total={Number(paginationInfo.total)}
            prev-text="上一页"
            next-text="下一页"
            layout={layoutInfo.value}
          ></el-pagination>
        </section>
      );
    };
  },
});
