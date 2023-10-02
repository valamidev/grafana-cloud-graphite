import { GraphiteCounter } from "../src/handlers/metricTypes/counter";

describe("GraphiteCounter", () => {
  it("should increment the count when inc() is called", () => {
    const counter = new GraphiteCounter("test", 1000);
    expect(counter.get()[0].value).toBe(0);
    counter.inc();
    expect(counter.get()[0].value).toBe(1);
  });

  it("should reset the count when reset() is called", () => {
    const counter = new GraphiteCounter("test", 1000);
    counter.inc();
    counter.inc();
    expect(counter.get()[0].value).toBe(2);
    counter.reset();
    expect(counter.get()[0].value).toBe(0);
  });

  it("should return the count when get() is called", () => {
    const counter = new GraphiteCounter("test", 1000);
    counter.inc();
    counter.inc();
    expect(counter.get()[0].value).toBe(2);
  });

  it("should return the count and tags when get() is called with tags", () => {
    const counter = new GraphiteCounter("test", 1000, { foo: "bar" });
    counter.inc();
    counter.inc();
    expect(counter.get()[0].value).toBe(2);
    expect(counter.get()[0].tags).toEqual({ foo: "bar" });
  });

  it("should return the count and time when clear() is called", () => {
    const counter = new GraphiteCounter("test", 1000);
    counter.inc();
    counter.inc();
    const data = counter.clear();
    expect(data[0].value).toBe(2);
    expect(data[0].time).toBeGreaterThan(0);
  });
});
