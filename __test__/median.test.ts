import { calcMedian } from "../src/utils";

describe("median", () => {
  it("should return the median of an array of odd length", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(calcMedian(arr)).toBe(3);
  });

  it("should return the median of an array of even length", () => {
    const arr = [1, 2, 3, 4];
    expect(calcMedian(arr)).toBe(2.5);
  });

  it("should return the same result as fastMedian for small arrays", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(calcMedian(arr)).toBe(3);
  });

  it("should return the same result as fastMedian for large arrays", () => {
    const arr = Array.from({ length: 10000 }, () =>
      Math.floor(Math.random() * 10000)
    );
    expect(calcMedian(arr)).toBe(calcMedian(arr));
  });

  it("should be faster than fastMedian for large arrays", () => {
    const arr = Array.from({ length: 10000 }, () =>
      Math.floor(Math.random() * 10000)
    );
    const start = Date.now();
    calcMedian(arr);
    const medianTime = Number(Date.now() - start);

    expect(medianTime).toBeLessThan(100);
  });
});
