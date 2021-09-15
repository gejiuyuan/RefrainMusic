import { NDropdown, NGradientText, NIcon, NInputNumber, NPagination, NSpace, NxButton } from "naive-ui";
import { defineComponent, Ref, PropType } from "vue";
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
    hasMore: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: true,
    }
  },
  setup(props, { slots, emit }) {

    const router = useRouter();
    const route = useRoute();

    const handleSizeChange = (curSize: number) => {
      router.push({
        query: {
          ...route.query,
          limit: curSize,
        },
      });
    }

    const handleCurrentChange = (curPage: number) => {
      router.push({
        query: {
          ...route.query,
          offset: curPage - 1,
        },
      });
    };

    return () => {
      const { hasMore, pagiInfo } = props
      const { offset, total, limit, sizeArr } = pagiInfo;
      return (
        <section class="naive-pagination">
          {
            total ? (
              <NPagination
                page={+offset + 1}
                itemCount={+total}
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
                      return <em>共{itemCount}项</em>
                    }
                  }
                }
              </NPagination>
            )
              : (
                <div class="no-total">
                  <NSpace align="center" size={20}>
                    <NxButton size="small" type="primary" ghost dashed disabled={+offset == 0} onClick={() => handleCurrentChange(+offset)}>上一页</NxButton>
                    <NGradientText type={"error" as any}>第 {+offset + 1} 页</NGradientText>
                    <NxButton size="small" type="primary" ghost dashed disabled={!hasMore} onClick={() => handleCurrentChange(+offset + 2)}>下一页</NxButton>
                    <NDropdown trigger="click" onSelect={handleSizeChange} options={sizeArr.map(s => ({ key: s, label: `${s}条/页` }))}>
                      <NxButton
                        type="primary"
                        size="tiny"
                        iconPlacement="right"
                        dashed
                        ghost
                      >
                        {{
                          default: () => limit,
                          icon: () => (
                            <i className="iconfont icon-xiajiantou"></i>
                          ),
                        }}
                      </NxButton>
                    </NDropdown>
                    <NInputNumber
                      disabled={+offset === 0 && !hasMore}
                      value={+offset + 1}
                      size="small"
                      onUpdateValue={(curOffset) => {
                        curOffset! > 0 && handleCurrentChange(curOffset!)
                      }}
                    ></NInputNumber>
                  </NSpace>

                </div>
              )
          }

        </section>
      )
    };
  },
});
