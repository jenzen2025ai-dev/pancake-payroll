function table1(v: number): number {
  if (v <= 144000) return 0;
  if (v <= 168000) return (v - 144000) * 0.02;
  if (v <= 216000) return 480 + (v - 168000) * 0.05;
  if (v <= 264000) return 2880 + (v - 216000) * 0.07;
  if (v <= 312000) return 6240 + (v - 264000) * 0.09;
  return 10800 + (v - 312000) * 0.12;
}

function table2(v: number): number {
  return table1(v) * 0.7;
}

export function calcM5Tax(annualIncome: number, table: "table1" | "table2" = "table1"): number {
  const raw = table === "table2" ? table2(annualIncome) : table1(annualIncome);
  return Math.round(raw / 12);
}
