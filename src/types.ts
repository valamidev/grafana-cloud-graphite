export interface GraphiteMetricsOptions {
  userId: string;
  token: string;
  ingestEndpointURL: string;
  namespace?: string;
  retryLimit?: number;
  retryDelay?: number;
}

export interface MetricSchema {
  name: string;
  interval: number;
  value: number;
  time: number;
  tags?: Record<string, string>;
}

export interface MetricSchemaRaw {
  name: string;
  interval: number;
  value: number;
  time: number;
  tags?: string[];
}

export interface IntervalMetrics {
  reset(): void;
  get(): MetricSchema[];
  clear(): MetricSchema[];
}

export interface Counter extends IntervalMetrics {
  inc(value?: number): void;
}

export interface Gauge extends IntervalMetrics {
  inc(value?: number): void;
  set(value?: number): void;
  dec(value?: number): void;
}

export interface Stats extends IntervalMetrics {
  add(value?: number): void;
}

export interface Histogram extends IntervalMetrics {
  value(value?: number): void;
}
