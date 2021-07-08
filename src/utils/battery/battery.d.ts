export declare type BatteryManagerEvents =
  | "onchargingchange"
  | "ondischargingtimechange"
  | "onlevel"
  | "onchargingtimechange";

export declare interface BatteryManager
  extends EventTarget,
    Record<BatteryManagerEvents, null | ((battery: BatteryManager) => void)> {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}
