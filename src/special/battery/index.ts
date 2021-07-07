import { BatteryManager } from "./battery";
import EventDispatcher from "../event";

/**
 *  Battery API
 *
 */

export const getBattery = async () => {
  let battery: PlainObject = {};
  try {
    battery = await navigator.getBattery();
  } catch (err) {
    battery =
      navigator.battery || navigator.mozBattery || navigator.webkitBattery;
  }
  return battery;
};

export default class BatteryMaster extends EventDispatcher {
  static CHARGSTATUSHOOKS = [
    "levelChange",
    "chargingChange",
    "chargingTimeChange",
    "dischargingTimeChange",
  ];

  public battery!: PlainObject;

  public getBattery: () => Promise<PlainObject> = getBattery;

  public usability!: boolean;

  //电池是否正在充电
  public charging!: boolean;

  //距离充满还要多久时间（单位：秒。为0时，表示已充满）
  public chargingTime!: number;

  //表示距离电池还可用多久时间（单位：秒）
  public dischargingTime!: number;

  //电池还剩多少容量（范围：0-1）
  public level!: number;

  constructor() {
    super();
  }

  public async asyncInitialize() {
    const battery = await this.getBattery();
    if ((this.usability = !!battery)) {
      this.battery = battery;
      this.charging = battery.charging;
      this.chargingTime = battery.chargingTime;
      this.dischargingTime = battery.dischargingTime;
      this.level = battery.level;
      BatteryMaster.CHARGSTATUSHOOKS.forEach((hook) => {
        battery.addEventListener(hook.toLocaleLowerCase(), (e: Event) => {
          const attr = hook.replace("Change", "");
          Reflect.set(
            this,
            attr,
            Reflect.get(e.target as BatteryManager, attr)
          );
          this.dispatch(hook, this);
        });
      });
    }
  }
}
