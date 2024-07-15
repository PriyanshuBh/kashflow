export const currencies = [
  { value: "USD", label: "$ Dollar", local: "en-US" },
  { value: "EUR", label: "€ Euro", local: "de-DE" },
  { value: "YEN", label: "¥ Yen", local: "ja-JP" },
  { value: "LKR", label: "Rs Rupee", local: "en-US" },
  { value: "QAR", label: "Qatari Riyal", local: "en-US" },
];

export type Currency = (typeof currencies)[0];
