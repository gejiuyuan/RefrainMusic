import { OptionMergeFunction, ComponentPublicInstance } from "vue";

export const errorHandler: (
  err: unknown,
  instance: ComponentPublicInstance | null,
  info: string
) => void = (err, vm, info) =>
  console.error(`1：message: ${err}、2：${vm}、3：${info}`);

export const warnHandler: (
  msg: string,
  instance: ComponentPublicInstance | null,
  trace: string
) => void = (msg, vm, trace) =>
  console.info(`1：message: ${msg}、2：${vm}、3：${trace}`);

export const globalProperties: Record<string, any> = {};

// export const isCustomElement: (tag: string) => boolean = (tag) => tag.startsWith('yuan-');

// export const optionMergeStrategies: Record<string, OptionMergeFunction> = {

// };

export const performance = true;
