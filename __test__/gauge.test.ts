import { GraphiteGauge } from "../src/handlers/metricTypes/gauge";

describe("GraphiteGauge", () => {
  let gauge: GraphiteGauge;

  beforeEach(() => {
    gauge = new GraphiteGauge("test_gauge", 1000);
  });

  it("should increment the count", () => {
    gauge.inc();
    expect(gauge.get()[0].value).toEqual(1);
  });

  it("should increment the count by a given value", () => {
    gauge.inc(5);
    expect(gauge.get()[0].value).toEqual(5);
  });

  it("should not increment the count when given a value of 0", () => {
    gauge.inc(0);
    expect(gauge.get()[0].value).toEqual(0);
  });

  it("should decrement the count", () => {
    gauge.inc(10);
    gauge.dec();
    expect(gauge.get()[0].value).toEqual(9);
  });

  it("should decrement the count by a given value", () => {
    gauge.inc(10);
    gauge.dec(5);
    expect(gauge.get()[0].value).toEqual(5);
  });

  it("should decrement the count by a given value", () => {
    gauge.set(10);
    expect(gauge.get()[0].value).toEqual(10);
  });

  it("should not decrement the count when given a value of 0", () => {
    gauge.inc(10);
    gauge.dec(0);
    expect(gauge.get()[0].value).toEqual(10);
  });

  it("should not allow negative values", () => {
    gauge.dec(10);
    expect(gauge.get()[0].value).toEqual(0);
  });

  it("should reset the count", () => {
    gauge.inc(10);
    gauge.reset();
    expect(gauge.get()[0].value).toEqual(0);
  });

  it("should return the correct metric schema", () => {
    gauge.inc(5);
    const metricSchema = gauge.get()[0];
    expect(metricSchema.name).toEqual("test_gauge");
    expect(metricSchema.interval).toEqual(1000);
    expect(metricSchema.value).toEqual(5);
    expect(metricSchema.tags).toBeUndefined();
  });

  it("should clear the count and return the correct metric schema", () => {
    gauge.inc(5);
    const metricSchema = gauge.clear()[0];
    expect(metricSchema.name).toEqual("test_gauge");
    expect(metricSchema.interval).toEqual(1000);
    expect(metricSchema.value).toEqual(5);
    expect(metricSchema.tags).toBeUndefined();
    expect(gauge.get()[0].value).toEqual(0);
  });
});
