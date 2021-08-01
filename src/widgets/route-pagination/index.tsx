import { is } from "@/utils";
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
  setup(props, { slots, emit }) {

    const router = useRouter();
    const route = useRoute();

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
      let { offset, total, limit, sizeArr } = props.pagiInfo;
      is.string(total) && (total = +total);
      return (
        <section class="naive-pagination">

          <NPagination
            page={+offset + 1}
            itemCount={total}
            pageSize={+limit}
            pageSizes={sizeArr}
            onUpdatePage={handleCurrentChange}
            onUpdatePageSize={handleSizeChange}
            show-quick-jumper
            show-size-picker
          >
            {
              {
                prefix({ itemCount }: PlainObject<number>) {
                  if (itemCount !== void 0) {
                    return <em>共{itemCount}项</em>
                  }
                }
              }
            }
          </NPagination>
        </section>
      )
    };
  },
});
