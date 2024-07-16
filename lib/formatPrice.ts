export const formatPriceLKA = (amount: number) => {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKA",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPriceQAT = (amount: number) => {
  return new Intl.NumberFormat("en-QA", {
    style: "currency",
    currency: "QAT",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPrice = (amount: number, code: string) => {
  if (!code) return "0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
