import { GraphiteMetrics } from "../src/handlers/metricsHandler";

describe("GraphiteMetrics", () => {
  let graphiteMetrics: GraphiteMetrics;

  beforeEach(() => {
    graphiteMetrics = new GraphiteMetrics({
      ingestEndpointURL: "localhost",
      token: "test",
      userId: "test",
      namespace: "namespace",
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
});
