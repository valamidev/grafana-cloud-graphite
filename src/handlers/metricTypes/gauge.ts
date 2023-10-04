import { Gauge, MetricSchema } from "../../types";

export class GraphiteGauge implements Gauge {
  private count = 0;

  constructor(
    public readonly name: string,
    public readonly interval: number,
    public readonly tags?: Record<string, string>
  ) {}

  get(): MetricSchema[] {
    return [
      {
        name: this.name,
        interval: this.interval,
        value: this.count,
        time: Date.now(),
        tags: this.tags,
      },
    ];
  }

  clear(): MetricSchema[] {
    const data = this.get();
    this.reset();
    return data;
  }

  inc(value?: number): void {
    if (value === 0) {
      return;
    }

    this.count = value ? this.count + value : this.count + 1;
  }

  dec(value?: number): void {
    if (value === 0) {
      return;
    }
    // Do not allow negative values
    if ((value ? this.count - value : this.count - 1) < 0) {
      return;
    }

    this.count = value ? this.count - value : this.count - 1;
  }

  reset(): void {
    this.count = 0;
  }
}
