import { GraphiteMetrics } from "../src/handlers/metricsHandler";
import { sleep } from "../src/utils";

describe("GraphiteMetrics", () => {
  let graphiteMetrics: GraphiteMetrics;

  beforeEach(() => {
    graphiteMetrics = new GraphiteMetrics({
      ingestEndpointURL: "https://google.com",
      token: "test",
      userId: "test",
      namespace: "namespace",
      retryDelay: 10,
      retryLimit: 3,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    graphiteMetrics.stop();
  });

  it("should register a counter metric", () => {
    const counter = graphiteMetrics.registerCounter("test.counter", 1000);

    expect(counter).toBeDefined();

    counter.inc();

    expect((counter as any).count).toBe(1);
  });

  it("should register a counter metric with tags", () => {
    const counter = graphiteMetrics.registerCounter("test.counter", 1000, {
      tag1: "value1",
      tag2: "value2",
    });

    expect(counter).toBeDefined();
    expect((counter as any).name).toBe("namespace.test.counter");
    expect((counter as any).interval).toBe(1000);
    expect((counter as any).tags).toEqual({ tag1: "value1", tag2: "value2" });
  });

  it("should throw Error when send metric ", async () => {
    const counter = graphiteMetrics.registerCounter("test.counter", 1000, {
      tag1: "value1",
      tag2: "value2",
    });

    counter.inc();

    let errors: any[] = [];

    graphiteMetrics.on("error", (error: any) => {
      errors.push(error.message);
    });

    await sleep(2000);

    expect(counter).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain("Failed to send metrics:");
  }, 8000);
});
