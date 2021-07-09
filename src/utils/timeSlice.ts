export type StepCbFactor = Record<
  "priority" | "upperLimit" | "interval",
  number
>;

export class TimeSlice {
  private priority = 0;

  private stepReq = 0;

  public upperLimit = 1;

  public interval = 1;

  constructor(factor: Partial<Pick<StepCbFactor, "interval" | "upperLimit">>) {
    const { interval = 1, upperLimit = 1 } = factor;
    this.upperLimit = upperLimit; //加interval是为了保证多余的少于interval数量的内容正常显示
    this.interval = interval;
  }

  public reset() {
    this.priority = 0;
    this.cancel();
  }

  public cancel() {
    cancelAnimationFrame(this.stepReq);
  }

  public step(cb: (this: TimeSlice, factor: StepCbFactor) => void) {
    let { upperLimit, priority, interval } = this;
    const realUpperLimit = upperLimit + interval;
    let realPriority = priority;
    return new Promise((resolve, reject) => {
      const step = () => {
        this.stepReq = requestAnimationFrame(() => {
          realPriority += interval;
          realPriority > upperLimit
            ? (priority = upperLimit)
            : (priority = realPriority);

          this.priority = priority;
          const cbFactor = { priority, upperLimit, interval };
          if (realPriority < realUpperLimit) {
            try {
              cb.call(this, cbFactor);
            } catch (err) {
              reject(err);
            }
            step();
          } else {
            resolve(cbFactor);
          }
        });
      };
      step();
    });
  }
}
