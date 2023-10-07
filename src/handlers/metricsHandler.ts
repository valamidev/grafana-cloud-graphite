import {
  Counter,
  Gauge,
  GraphiteMetricsOptions,
  IntervalMetrics,
  MetricSchema,
  Stats,
} from "../types";
import { GraphiteHTTP } from "./httpHandler";
import { GraphiteCounter } from "./metricTypes/counter";
import EventEmitter from "events";
import { GraphiteGauge } from "./metricTypes/gauge";
import { GraphiteStats } from "./metricTypes/stats";

export class GraphiteMetrics extends EventEmitter {
  private readonly httpHandler: GraphiteHTTP;

  private metricsStore = new Map<number, IntervalMetrics[]>();
  private intervalHandlers = new Map<number, NodeJS.Timeout>();

  constructor(private options: GraphiteMetricsOptions) {
    super();
    this.httpHandler = new GraphiteHTTP({ ...this.options });
  }

  public registerCounter(
    name: string,
    interval: number,
    tags?: Record<string, string>
  ): Counter {
    const metrics = new GraphiteCounter(
      this.options.namespace ? `${this.options.namespace}.${name}` : name,
      interval,
      tags
    );

    this.registerMetric(metrics, interval);

    return metrics;
  }

  public registerStats(
    name: string,
    interval: number,
    tags?: Record<string, string>
  ): Stats {
    const metrics = new GraphiteStats(
      this.options.namespace ? `${this.options.namespace}.${name}` : name,
      interval,
      tags
    );

    this.registerMetric(metrics, interval);

    return metrics;
  }

  public registerGauge(
    name: string,
    interval: number,
    tags?: Record<string, string>
  ): Gauge {
    const metrics = new GraphiteGauge(
      this.options.namespace ? `${this.options.namespace}.${name}` : name,
      interval,
      tags
    );

    this.registerMetric(metrics, interval);

    return metrics;
  }

  public stop(): void {
    this.intervalHandlers.forEach((interval) => {
      clearInterval(interval);
    });
  }

  private registerMetric(metric: IntervalMetrics, interval: number): void {
    if (this.metricsStore.has(interval) === false) {
      this.metricsStore.set(interval, []);
      this.registerIntervalHandler(interval);
    }

    this.metricsStore.get(interval)?.push(metric);
  }

  private registerIntervalHandler(interval: number): void {
    if (this.intervalHandlers.has(interval)) {
      return;
    }

    this.intervalHandlers.set(
      interval,
      setInterval(async () => {
        const metrics = this.metricsStore.get(interval);

        if (!metrics || metrics?.length === 0) {
          return;
        }

        const data: MetricSchema[] = [];

        metrics.forEach((metric) => {
          data.push(...metric.clear());
        });

        try {
          await this.httpHandler.sendMetrics(data);
        } catch (error) {
          this.emit("error", error);
        }
      }, interval)
    );
  }
}
