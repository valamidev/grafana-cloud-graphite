import { GraphiteStats } from "../src/handlers/metricTypes/stats";
import { calcMedian, calculateAverage } from "../src/utils";

// Mock calcMedian function if needed
jest.mock("../src/utils", () => ({
  calcMedian: jest.fn(),
  calculateAverage: jest.fn(),
}));

describe("GraphiteStats", () => {
  let graphiteStats: any;

  beforeEach(() => {
    graphiteStats = new GraphiteStats("test", 1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default values", () => {
    expect(graphiteStats).toHaveProperty("name", "test");
    expect(graphiteStats).toHaveProperty("interval", 1);
  });

  it("should get metrics correctly", () => {
    (calcMedian as jest.MockedFunction<typeof calcMedian>).mockReturnValue(3);
    (
      calculateAverage as jest.MockedFunction<typeof calculateAverage>
    ).mockReturnValue(2);
    graphiteStats.add(1);
    graphiteStats.add(2);
    graphiteStats.add(3);
    const metrics = graphiteStats.get();
    expect(metrics).toHaveLength(4);
    expect(metrics[0]).toMatchObject({
      name: "test.min",
      interval: 1,
      value: 1,
      tags: undefined,
    });
    expect(metrics[1]).toMatchObject({
      name: "test.max",
      interval: 1,
      value: 3,
      tags: undefined,
    });
    expect(metrics[2]).toMatchObject({
      name: "test.avg",
      interval: 1,
      value: 2,
      tags: undefined,
    });
    expect(metrics[3]).toMatchObject({
      name: "test.median",
      interval: 1,
      value: 3,
      tags: undefined,
    });
  });

  it("should clear metrics correctly", () => {
    graphiteStats.add(1);
    graphiteStats.add(2);
    const clearedData = graphiteStats.clear();
    expect(clearedData).toHaveLength(4);
    expect(graphiteStats["values"]).toHaveLength(0);
  });

  it("should reset correctly", () => {
    graphiteStats.add(1);
    graphiteStats.add(2);
    graphiteStats.reset();
    expect(graphiteStats["count"]).toEqual(0);
    expect(graphiteStats["values"]).toHaveLength(0);
  });
});
