import fetch from "node-fetch";
import { MetricSchema, MetricSchemaRaw } from "../types";
import { sleep } from "../utils";

export class GraphiteHTTP {
  private readonly authToken: string;
  private readonly ingestEndpointURL: string;
  private readonly retryLimit: number;
  private readonly retryDelay: number;

  constructor(options: {
    userId: string;
    token: string;
    ingestEndpointURL: string;
    retryLimit?: number;
    retryDelay?: number;
  }) {
    this.authToken = `${options.userId}:${options.token}`;
    this.ingestEndpointURL = options.ingestEndpointURL;
    this.retryLimit = options.retryLimit ?? 3;
    this.retryDelay = options.retryDelay ?? 1000;
  }

  async sendMetrics(data: MetricSchema | MetricSchema[]): Promise<void> {
    const dataArray = Array.isArray(data) === true ? data : [data];

    const metricsToSend: MetricSchemaRaw[] = (dataArray as MetricSchema[]).map(
      (metric) => ({
        ...metric,
        interval: Math.floor(metric.interval / 1000), // Convert to seconds
        time: Math.floor(metric.time / 1000), // Convert to Unix Timestamp
        tags: metric.tags
          ? Object.entries(metric.tags).map(([key, value]) => `${key}=${value}`)
          : undefined,
      })
    );

    return await this.HttpSend(
      JSON.stringify(metricsToSend, (key, value) => {
        if (value !== undefined) return value;
      })
    );
  }

  private async HttpSend(payload: string, retry = 0): Promise<void> {
    let canRetry = true;

    if (retry > this.retryLimit) {
      canRetry = false;
    }

    try {
      const response = await fetch(this.ingestEndpointURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
        body: payload,
      });

      if ([401, 403, 404].includes(response.status)) {
        canRetry = false;
        throw new Error(
          `Failed to send metrics, invalid URL ${response.status} - ${response.statusText}`
        );
      }

      if (!response.ok) {
        throw new Error(
          `Failed to send metrics: ${response.status} - ${response.statusText}`
        );
      }
    } catch (error) {
      if (canRetry === false) {
        throw error;
      }

      await sleep(Math.pow(2, retry) * this.retryDelay);

      return this.HttpSend(payload, retry + 1);
    }
  }
}
