export type Role = "admin" | "employee";

export interface Employee {
  id: number;
  name: string;
  englishName?: string;
  jobTitle?: string;
  department?: string;
  baseSalary: number;
  fixedAllowance: number;
  fssEmployer?: number;
  fssEmployee?: number;
  m5TaxTable?: "table1" | "table2";
  joinedAt?: string;
  status?: "active" | "inactive";
}

export interface PayrollInput {
  emp: Employee;
  period: string;
  otHours?: number;
  otRate?: number;
  shDays?: number;
  noPayLeaveDays?: number;
  tipPay?: number;
  m5Tax?: number;
  fssEmp?: number;
}

export interface PayrollResult extends PayrollInput {
  gross: number;
  otPay: number;
  shPay: number;
  noPayDeduction: number;
  taxable: number;
  m5TaxCalc: number;
  fssEmpCalc: number;
  net: number;
}

export interface UserSession {
  userId: number;
  username: string;
  role: Role;
  employeeId?: number;
}
