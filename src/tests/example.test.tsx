import { add } from "../features/testing_feature";

test("test add", () => {
  expect(add(2, 3)).toBe(5);
});

test("test with negatives", () => {
  expect(add(-2, -3)).toBe(-5);
});