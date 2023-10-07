import { MetricSchema, Stats } from "../../types";
import { calcMedian } from "../../utils";

export class GraphiteStats implements Stats {
  private count = 0;
  private values: number[] = [];

  constructor(
    public readonly name: string,
    public readonly interval: number,
    public readonly tags?: Record<string, string>
  ) {}

  private calculateAverage(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  get(): MetricSchema[] {
    const median = calcMedian(this.values);
    const avg = this.calculateAverage(this.values);

    const time = Date.now();

    if (!this.values.length) return [];

    return [
      {
        name: `${this.name}.min`,
        interval: this.interval,
        value: Math.min(...this.values),
        time,
        tags: this.tags,
      },
      {
        name: `${this.name}.max`,
        interval: this.interval,
        value: Math.max(...this.values),
        time,
        tags: this.tags,
      },
      {
        name: `${this.name}.avg`,
        interval: this.interval,
        value: avg,
        time,
        tags: this.tags,
      },
      {
        name: `${this.name}.median`,
        interval: this.interval,
        value: median ?? 0,
        time,
        tags: this.tags,
      },
    ];
  }

  clear(): MetricSchema[] {
    const data = this.get();
    this.reset();
    return data;
  }

  add(value?: number): void {
    this.count = this.count + 1;
    if (value) {
      this.values.push(value);
    }
  }

  reset(): void {
    this.count = 0;
    this.values = [];
  }
}
