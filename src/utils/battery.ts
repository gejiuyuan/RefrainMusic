import EventDispatcher from "./event/event";

export type BatteryManagerEvents =
  "onlevel" |
  "onchargingchange" |
  "onchargingtimechange" |
  "ondischargingtimechange";

export interface BatteryManager extends EventTarget, Record<
  BatteryManagerEvents,
  null | ((battery: BatteryManager) => void)
> {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

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

export const BATTERY_CHARGSTATUS_HOOKS = [
  "levelChange",
  "chargingChange",
  "chargingTimeChange",
  "dischargingTimeChange",
];

export class BatteryMaster extends EventDispatcher {

  public battery!: PlainObject;

  public getBattery: () => Promise<PlainObject> = getBattery;

  public isSupported!: boolean;

  //电池是否正在充电
  public charging!: boolean;

  //距离充满还要多久时间（单位：秒。为0时，表示已充满）
  public chargingTime!: number;

  //表示距离电池还可用多久时间（单位：秒）
  public dischargingTime!: number;

  //电池还剩多少容量（范围：0-1）
  public level!: number;

  constructor() {
    super('battery');
  }

  public async asyncInitialize() {

    const battery = await this.getBattery();

    if ((this.isSupported = !!battery)) {

      const { level, charging, chargingTime, dischargingTime } = this.battery = battery;
      this.level = level;
      this.charging = charging;
      this.chargingTime = chargingTime;
      this.dischargingTime = dischargingTime;

      BATTERY_CHARGSTATUS_HOOKS.forEach((hook) => {

        battery.addEventListener(
          hook.toLocaleLowerCase(),
          (e: Event) => {
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
