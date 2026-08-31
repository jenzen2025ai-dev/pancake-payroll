import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { calc } from "../lib/payroll";
import { fmt } from "../lib/format";
import { periods } from "../lib/periods";
import type { Employee, PayrollResult } from "../types";

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [emp, setEmp] = useState<Employee | null>(null);
  const [result, setResult] = useState<PayrollResult | null>(null);
  const period = periods()[3];

  useEffect(() => {
    api.employees().then((rows: Employee[]) => {
      const me = rows.find(r => r.id === user?.employeeId) || rows[0];
      setEmp(me);
      if (me) setResult(calc({ emp: me, period, otHours: 0, shDays: 0, noPayLeaveDays: 0, tipPay: 0, m5Tax: -1 }));
    });
  }, [user, period]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">??蝟批</h1>
        <button onClick={logout} className="text-sm text-gray-600 underline">?餃</button>
      </div>
      {emp && result && (
        <div className="bg-white rounded shadow p-6 space-y-2">
          <div className="text-lg font-semibold">{emp.name} {emp.englishName ? `(${emp.englishName})` : ""}</div>
          <div className="text-sm text-gray-500">{emp.jobTitle} / {emp.department} / {period}</div>
          <hr className="my-3" />
          <Row label="摨" v={fmt.format(result.emp.baseSalary)} />
          <Row label="?箏?瘣亥票" v={fmt.format(result.emp.fixedAllowance)} />
          <Row label="蝮賣?? v={fmt.format(result.gross)} />
          <Row label="M/5 ?瑟平蝔? v={fmt.format(result.m5TaxCalc)} />
          <Row label="FSS ?勗" v={fmt.format(result.fssEmpCalc)} />
          <Row label="撖行" v={fmt.format(result.net)} highlight />
        </div>
      )}
    </div>
  );
}

function Row({ label, v, highlight }: { label: string; v: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between ${highlight ? "font-bold text-blue-700 text-lg" : ""}`}>
      <span>{label}</span>
      <span>{v}</span>
    </div>
  );
}
