import { useBattery } from "@utils/use";
import Vue, {
  defineComponent,
  reactive,
  ref,
  nextTick,
  watch,
  watchEffect,
  computed,
} from "vue";
import { decimalToPercent } from "@utils/index";
import "./index.scss";

export default defineComponent({
  name: "Battery",
  setup(props, { emit, slots }) {
    const batterySetting = reactive({
      text: "",
      title: "",
    });
    const batteryInfo = ref({
      charging: false,
      chargingTime: 0,
      dischargingTime: 0,
      level: 0,
      usability: false,
    });
    watchEffect(() => {
      batterySetting.text = decimalToPercent(batteryInfo.value.level);
    });

    (async () => {
      batteryInfo.value = await useBattery();
    })();

    const curBatteryStyle = computed(() => ({
      fill: "#2bd38d",
      "clip-path": `polygon(0 0, ${batterySetting.text} 0, ${batterySetting.text} 100%, 0 100%)`,
    }));

    return () => {
      const { usability, charging } = batteryInfo.value;
      if (!usability) return;
      return (
        <section class="yplayer-head-battery">
          <i title={batterySetting.title}>
            <svg class="icon icon-battery" viewBox="0 0 1024 1024">
              <rect
                x="150"
                y="340"
                width="680"
                height="350"
                style={curBatteryStyle.value}
              />
              <path
                v-show={charging}
                d="M512 393.216 229.376 512 430.08 512 471.04 630.784 753.664 512 552.96 512Z"
                fill="#555"
              ></path>
              <path
                d={`M913.408 430.08l0-81.92c0-45.056-36.864-81.92-81.92-81.92L151.552 266.24c-45.056 
          0-81.92 36.864-81.92 81.92l0 319.488c0 45.056 36.864 81.92 81.92 81.92l684.032 0c45.056 
          0 81.92-36.864 81.92-81.92l0-81.92c20.48 0 40.96-16.384 40.96-40.96l0-81.92C954.368 
          450.56 933.888 430.08 913.408 430.08zM872.448 471.04l0 81.92 0 118.784c0 20.48-16.384 
          40.96-40.96 40.96L151.552 712.704c-20.48 0-40.96-16.384-40.96-40.96L110.592 352.256c0-20.48 
          16.384-40.96 40.96-40.96l684.032 0c20.48 0 40.96 16.384 40.96 40.96L876.544 471.04z`}
                fill="#555"
              ></path>
            </svg>
          </i>
          <span class="head-battery-text">{batterySetting.text}</span>
        </section>
      );
    };
  },
});
