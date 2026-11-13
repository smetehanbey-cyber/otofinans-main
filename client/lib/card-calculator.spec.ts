import { describe, expect, it } from "vitest";
import { calculateCardPlan, parseCardInput } from "./card-calculator";

describe("card settlement calculation", () => {
  it("reproduces the supplied reference without labeling the deduction as interest", () => {
    const plan = calculateCardPlan(320000, 26.5, 12, "net")!;
    expect(plan.gross).toBe(435374.15);
    expect(plan.deduction).toBe(115374.15);
    expect(plan.installment).toBe(36281.18);
    expect(plan.schedule[plan.schedule.length - 1].amount).toBe(36281.17);
  });
  it("derives net proceeds from a known card charge", () => {
    expect(calculateCardPlan(435374.15, 26.5, 12, "gross")?.net).toBe(320000);
  });
  it("allocates every cent exactly across all terms and both calculation directions", () => {
    for (const mode of ["net", "gross"] as const) {
      for (let months = 1; months <= 12; months++) {
        for (const amount of [1, 100.01, 320000, 9999999.99]) {
          const plan = calculateCardPlan(amount, 26.5, months, mode)!;
          expect(
            plan.schedule.reduce(
              (sum, row) => sum + Math.round(row.amount * 100),
              0,
            ),
          ).toBe(Math.round(plan.gross * 100));
          expect(plan.schedule[plan.schedule.length - 1].balance).toBe(0);
          expect(Math.round((plan.net + plan.deduction) * 100)).toBe(
            Math.round(plan.gross * 100),
          );
        }
      }
    }
  });
  it("handles zero deduction and single payment", () => {
    const plan = calculateCardPlan(1000.01, 0, 1, "net")!;
    expect(plan.deduction).toBe(0);
    expect(plan.installment).toBe(1000.01);
  });
  it("rejects invalid and out-of-range values", () => {
    for (const amount of [NaN, Infinity, 0, -1, 10000001])
      expect(calculateCardPlan(amount, 26.5, 12, "net")).toBeNull();
    for (const rate of [NaN, Infinity, -1, 100])
      expect(calculateCardPlan(320000, rate, 12, "net")).toBeNull();
    for (const months of [0, 13, 2.5, NaN])
      expect(calculateCardPlan(320000, 26.5, months, "net")).toBeNull();
  });
  it("parses Turkish amounts and comma or point percentage inputs", () => {
    expect(parseCardInput("320.000,50", "amount")).toBe(320000.5);
    expect(parseCardInput("320000", "amount")).toBe(320000);
    expect(parseCardInput("26,5", "rate")).toBe(26.5);
    expect(parseCardInput("26.5", "rate")).toBe(26.5);
    for (const text of ["", "1e5", "abc", "32.00", "1,2,3", "-10"])
      expect(parseCardInput(text, "amount")).toBeNaN();
  });
});
