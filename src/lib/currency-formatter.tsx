export function formatCurrencyToNPR(amount: number) {
  const finalValue = new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
  }).format(amount);
  return finalValue;
}
