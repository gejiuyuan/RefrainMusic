import { onMounted, ref } from "@vue/runtime-core";
import BatteryMaster from "@special/battery";
import { onUnmounted, shallowReactive } from "vue";

export function useTimeSlice(upperLimit = 10) {
  const showPriority = ref(0);
  const runShowPriority = () => {
    const step = () => {
      requestAnimationFrame(() => {
        showPriority.value++;
        if (showPriority.value < upperLimit) {
          step();
        }
      });
    };
    step();
  };
  onMounted(() => {
    runShowPriority();
  });

  return (priority: number) => {
    showPriority.value >= priority;
  };
}

export async function useBattery() {
  const battery = new BatteryMaster();
  await battery.asyncInitialize();
  const { charging, chargingTime, dischargingTime, level, usability } = battery;
  const batteryInfo = shallowReactive({
    charging,
    chargingTime,
    dischargingTime,
    level,
    usability,
  });
  if (usability) {
    const chargingChangeCb = ({ charging }: any) => {
      batteryInfo.charging = charging;
    };
    const levelChangeCb = ({ level }: any) => {
      batteryInfo.level = level;
    };
    battery.on("chargingChange", chargingChangeCb);
    battery.on("levelChange", levelChangeCb);
    onUnmounted(() => {
      battery.off("chargingChange", chargingChangeCb);
      battery.off("levelChange", levelChangeCb);
    });
  }
  return batteryInfo;
}
