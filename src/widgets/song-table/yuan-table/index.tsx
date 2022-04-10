import { ref, computed, defineComponent, PropType, isVNode, getCurrentInstance, provide, inject, ComponentPublicInstance } from "vue";
import {
  EMPTY_ARR,
  is,
} from "@utils/index";
import { NGrid, NGridItem } from "naive-ui";
import "./index.scss";
import { useParent } from "@/hooks/useParent";
import { useChildren } from "@/hooks/useChildren";

export const YUAN_TABLE_KEY = Symbol('YuanTable');


export default defineComponent({
  name: "YuanTable",
  props: {
    class: {
      type: String as PropType<string>,
      require: false,
      default: '',
    },
    data: {
      type: Array as PropType<Array<any>>,
      requried: false,
      default: () => EMPTY_ARR,
    },
    showSerial: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    serialDefiner: {
      type: Function as PropType<(serial: number) => number>,
      required: false,
      default: (serial: number) => serial,
    },
    rowClass: {
      type: String as PropType<string>,
      required: false,
      default: '',
    }
  },
  setup(props, { slots, emit }) {

    const { linkChildren } = useChildren<ComponentPublicInstance, { props: typeof props }>(YUAN_TABLE_KEY)

    linkChildren({ props })

    return () => {
      const { data } = props;
      if (is.emptyArray(data)) {
        return
      }
      const { class: className, showSerial, rowClass, serialDefiner } = props;
      const slotArr = slots.default!().filter(({ type }) => is.object(type) && Reflect.get(type, 'name'));
      const totalSpan = slotArr.map(slot => slot!.props?.span || 1).reduce((a, b) => a + b);

      return (
        <section class={`yuan-table ${className}`}>
          <header class="yuan-table-header">
            <div class="yuan-table-layer header-layer">
              {
                showSerial && <div class="grid-item">序号</div>
              }
              <NGrid
                class={`layer-grid`}
                cols={totalSpan}
              >
                {
                  slotArr.map((slot, i) => {
                    const props = slot!.props!;
                    let { span } = props;
                    const { label } = props;
                    !Number.isFinite(+span) && (span = 1);
                    return (
                      <NGridItem class="grid-item" span={span}>
                        {is.function(label) ? label() : label}
                      </NGridItem>
                    )
                  })
                }
              </NGrid>
            </div>
          </header>
          <section class="yuan-table-body">
            {
              data.map((item, index) => {
                return (
                  <div class={`yuan-table-layer body-layer ${rowClass}`}>
                    {
                      showSerial && <div class="grid-item">{serialDefiner(index)}</div>
                    }
                    <NGrid
                      class={`layer-grid`}
                      cols={totalSpan}
                    >
                      {
                        slotArr.map(slot => <NGridItem class="grid-item" span={slot!.props!.span || 1}>{slot}</NGridItem>)
                      }
                    </NGrid>
                  </div>
                )
              })
            }
          </section>

        </section>

      )
    }
  }
});


export const YuanTableColumn = defineComponent({
  name: "YuanTableColumn",
  props: {
    label: {
      type: [String, Function] as PropType<string | (() => any)>,
      requried: false,
      default: '',
    },
    span: {
      type: Number as PropType<number>,
      required: false,
      default: 1
    }
  },
  setup(props, { slots, emit }) {
    const { parent, index } = useParent(YUAN_TABLE_KEY);

    if (!parent) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`<YuanTableColumn> must be a child component of <YuanTable>`)
      }
      return;
    }

    return () => {
      const data = parent.props.data;
      const dataIndex = data.length && Math.floor(index.value % ((data.length - 1) || 1));

      return (
        <div class="yuan-table-column">
          {
            slots.default!(data[dataIndex])
          }
        </div>
      )

    }
  }
})