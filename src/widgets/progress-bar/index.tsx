import {
    defineComponent,
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    PropType,
    toRefs,
    watch,
    useCssVars,
    ref,
    computed,
    reactive,
    shallowReactive,
    DefineComponent,
} from "vue";
import {
    decimalToPercent,
    getElmRectInfo,
    percentToDecimal,
} from '@utils/index';
import './index.scss';

import { useEventListener } from '@vueuse/core';

export interface StripPrjt {
    long: number;
    offset: number;
    attrs: Partial<Record<"dir" | "offset" | "long" | "mouseOffset", string>>;
};

export type ProgressInfo = {
    ratio: string;
    decimal: number;
}

export declare type ProgressBarComp = DefineComponent<{
    dir: {
        type: PropType<string>;
        default: string;
    },
    bgc: {
        type: PropType<string>;
        default: string;
    },
    dotFixed: {
        type: BooleanConstructor;
        default: boolean;
    },
    bufferRatio: {
        type: PropType<string | number>;
        default: number;
    },
    currentRatio: {
        type: NumberConstructor;
        default: number;
    },
}, any, any, any, any, any, any, any, any>;

const ProgressBar: ProgressBarComp = defineComponent({
    name: "ProgressBar",
    props: {
        dir: {
            type: String,
            required: false,
            default: "horizontal",
        },
        bgc: {
            type: String,
            required: false,
            default: "rgba(160, 160, 160, 0.15)",
        },
        dotFixed: {
            type: Boolean,
            required: false,
            default: false,
        },
        bufferRatio: {
            type: [String, Number],
            required: false,
            default: 0,
        },
        currentRatio: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    emits: ["change", "down", "move", "up"],
    setup(props, { slots, emit }) {
        const vm = getCurrentInstance()!; //即this组件实例 
        
        //是否可以移动
        const canMove = ref(false);
        //当前进度条状态
        const currentProgress = shallowReactive<ProgressInfo>({
            decimal: 0, //零点几
            ratio: "0%", //百分比
        });
        //进度条信息
        const progressbarInfo = reactive<StripPrjt>({
            long: 0,
            offset: 0,
            attrs: {
                dir: "", offset: "", long: "", mouseOffset: "",
            },
        });
        //是否显示控制点
        const isShowDot = ref(props.dotFixed);
        //进度条元素引用
        const stripElmRef = ref<Element>()

        //进度条class
        const progressbarClass = computed(() => {
            return ["progressbar", `progressbar-${props.dir}`].join(" ");
        });

        //进入背景
        const progressbarBufferStyle = computed(() => {
            return {
                backgroundColor: props.bgc
            }
        })

        //当前进度样式
        const progressbarCurrentStyle = computed(() => {
            const dir = props.dir;
            const ratio = currentProgress.ratio;
            const toDir = dir === 'horizontal' ? 'right' : 'bottom';
            return {
                backgroundImage: `linear-gradient(to ${toDir},var(--theme) ${ratio},transparent ${ratio})`,
            }
        })

        //控制小圆点样式
        const progressbarDotStyle = computed(() => {
            const dir = props.dir;
            const ratio = currentProgress.ratio;
            const styleObj = {
                left: '50%',
                top: '50%'
            }
            const willChangeAttr = dir === 'horizontal' ? 'left' : 'top';
            styleObj[willChangeAttr] = ratio;
            return styleObj;
        })

        //获取偏移值
        const getTranslate = (ev: PlainObject) => {
            const { offset, long, attrs } = progressbarInfo;
            let tarTranslate = ev[attrs.mouseOffset!] - offset; 
            if (tarTranslate > long) {
                tarTranslate = long;
            } else if (tarTranslate < 0) {
                tarTranslate = 0;
            }
            return props.dir === "vertical"
                ? long - tarTranslate
                : tarTranslate;
        };

        //更新进度条状态
        const updateCurrentProgress = (ev: PlainObject) => {
            const translate = getTranslate(ev);
            const tarDemical = translate / progressbarInfo.long; 
            currentProgress.decimal = tarDemical;
            currentProgress.ratio = decimalToPercent(tarDemical, 2);
        };

        //按下进度条时
        const down = (ev: MouseEvent) => { 
            canMove.value = true;
            !props.dotFixed && (isShowDot.value = true);
            updateCurrentProgress(ev);
            emit("down", currentProgress);
            emit("change", currentProgress);
        };

        //移动进度条时
        const move = (ev: MouseEvent) => { 
            if (!canMove.value) return;
            updateCurrentProgress(ev); 
            emit("move", currentProgress);
            emit("change", currentProgress);
        };

        //松开进度条时
        const up = (ev: MouseEvent) => {
            if (canMove.value) {
                emit("up", currentProgress);
            }
            canMove.value = false;
            !props.dotFixed && (isShowDot.value = false);
        };

        useEventListener(document, "mousemove", move)
        useEventListener(document, "mouseup", up)

        watch(
            () => props.currentRatio,
            (val, oldVal) => {
                currentProgress.decimal = percentToDecimal(val);
                currentProgress.ratio = `${val}%`;
            },
            {
                immediate: true
            }
        );

        /**
         * 更新progressbar信息
         */
        const updateProgressbarInfo = () => {
            const { dir } = props;
            const stripElmRect = getElmRectInfo(stripElmRef.value!);
            const stripAttrs: PlainObject<string>[] = [
                { dir: "vertical", offset: "top", long: "height", mouseOffset: "pageY", },
                { dir: "horizontal", offset: "left", long: "width", mouseOffset: "pageX", },
            ];
            const tarAttrObj = stripAttrs.find(({ dir: tarDir }) => tarDir === dir)!; 
            progressbarInfo.long = Math.round(stripElmRect[tarAttrObj.long]);
            progressbarInfo.offset = Math.round(stripElmRect[tarAttrObj.offset]);
            progressbarInfo.attrs = tarAttrObj;
        };

        useEventListener('resize', updateProgressbarInfo)
        onMounted(updateProgressbarInfo);

        return () => {
            return (
                <div
                    ref={stripElmRef}
                    class={progressbarClass.value}
                    defaultdotshow={props.dotFixed}
                    showdot={isShowDot.value}
                    onMousedown={down}
                >
                    <div class="progressbar-buffer" style={progressbarBufferStyle.value}>
                        <div class="progressbar-current" style={progressbarCurrentStyle.value}></div>
                        <div class="progressbar-dot" style={progressbarDotStyle.value}></div>
                    </div>
                </div >
            )
        }
    }
})

export default ProgressBar