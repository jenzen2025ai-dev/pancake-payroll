import { calcM5Tax } from "./m5Tax";
import type { PayrollInput, PayrollResult } from "../types";

const DAY_BASE = 30;
const FSS_EMP_DEFAULT = 30;

export function calc(input: PayrollInput): PayrollResult {
  const emp = input.emp;
  const daily = (emp.baseSalary + emp.fixedAllowance) / DAY_BASE;
  const otRate = input.otRate ?? 1.2;
  const hourlyBase = (emp.baseSalary + emp.fixedAllowance) / (DAY_BASE * 8);
  const otPay = (input.otHours ?? 0) * hourlyBase * otRate;
  const shPay = (input.shDays ?? 0) * daily;
  const noPayDeduction = (input.noPayLeaveDays ?? 0) * daily;
  const tipPay = input.tipPay ?? 0;
  const gross = emp.baseSalary + emp.fixedAllowance + otPay + shPay + tipPay - noPayDeduction;
  const taxable = Math.max(0, gross);

  let m5TaxCalc = input.m5Tax === -1 || input.m5Tax === undefined
    ? calcM5Tax(taxable, emp.m5TaxTable ?? "table1")
    : input.m5Tax;
  if (input.m5Tax === 0) m5TaxCalc = 0;

  const fssEmpCalc = input.fssEmp ?? emp.fssEmployee ?? FSS_EMP_DEFAULT;
  const net = gross - m5TaxCalc - fssEmpCalc;

  return {
    ...input,
    otHours: input.otHours ?? 0,
    otRate,
    shDays: input.shDays ?? 0,
    noPayLeaveDays: input.noPayLeaveDays ?? 0,
    tipPay,
    m5Tax: input.m5Tax ?? -1,
    fssEmp: input.fssEmp ?? emp.fssEmployee ?? FSS_EMP_DEFAULT,
    gross,
    otPay,
    shPay,
    noPayDeduction,
    taxable,
    m5TaxCalc,
    fssEmpCalc,
    net
  };
}
