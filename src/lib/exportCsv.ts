import type { PayrollResult } from "../types";

export function exportCsv(rows: PayrollResult[], period: string) {
  const header = ['期間','姓名','底薪','固定津貼','OT時數','OT金額','法定假日津貼','無薪假扣','小費/津貼','總收入','M/5職業稅','FSS僱員','實收'];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([
      period,
      r.emp.name,
      r.emp.baseSalary,
      r.emp.fixedAllowance,
      r.otHours ?? 0,
      r.otPay.toFixed(2),
      r.shPay.toFixed(2),
      r.noPayDeduction.toFixed(2),
      r.tipPay ?? 0,
      r.gross.toFixed(2),
      r.m5TaxCalc.toFixed(2),
      r.fssEmpCalc.toFixed(2),
      r.net.toFixed(2)
    ].join(","));
  }
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payroll-${period}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
