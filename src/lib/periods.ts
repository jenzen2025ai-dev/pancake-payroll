export function periods() {
  const out: string[] = [];
  const now = new Date();
  for (let i = -3; i < 9; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}
