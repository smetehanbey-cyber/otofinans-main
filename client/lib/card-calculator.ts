export type CardCalculationMode = "net" | "gross";

/** Total POS deduction, not a monthly credit interest rate. All allocations use cents. */
export function calculateCardPlan(
  amount: number,
  rate: number,
  months: number,
  mode: CardCalculationMode,
) {
  if (
    !Number.isFinite(amount) ||
    amount < 1 ||
    amount > 10_000_000 ||
    !Number.isFinite(rate) ||
    rate < 0 ||
    rate > 99 ||
    !Number.isInteger(months) ||
    months < 1 ||
    months > 12 ||
    (mode !== "net" && mode !== "gross")
  )
    return null;
  const inputCents = Math.round(amount * 100);
  const grossCents =
    mode === "net" ? Math.round(inputCents / (1 - rate / 100)) : inputCents;
  const netCents =
    mode === "net" ? inputCents : Math.round(grossCents * (1 - rate / 100));
  const base = Math.floor(grossCents / months);
  const remainder = grossCents % months;
  let balance = grossCents;
  const schedule = Array.from({ length: months }, (_, i) => {
    const cents = base + (i < remainder ? 1 : 0);
    balance -= cents;
    return { number: i + 1, amount: cents / 100, balance: balance / 100 };
  });
  return {
    gross: grossCents / 100,
    net: netCents / 100,
    deduction: (grossCents - netCents) / 100,
    installment: schedule[0].amount,
    schedule,
  };
}

/** Turkish amounts: 320.000,50; rates may also use a decimal point. */
export function parseCardInput(value: string, kind: "amount" | "rate"): number {
  const trimmed = value.trim();
  if (!trimmed) return NaN;
  const pattern =
    kind === "amount"
      ? /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/
      : /^\d+(?:[.,]\d{1,2})?$/;
  if (!pattern.test(trimmed)) return NaN;
  return Number(
    (kind === "amount" ? trimmed.replace(/\./g, "") : trimmed).replace(
      ",",
      ".",
    ),
  );
}
