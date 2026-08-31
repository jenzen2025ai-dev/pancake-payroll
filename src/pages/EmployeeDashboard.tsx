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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 安全獲取周期：如果 periods()[3] 冇值，就用當前月份
  const allPeriods = periods();
  const period = allPeriods[3] || new Date().toISOString().slice(0, 7);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.employees()
      .then((rows: Employee[]) => {
        if (!isMounted) return;
        
        console.log("員工數據:", rows); // 除錯用
        console.log("當前用戶:", user); // 除錯用

        if (!rows || rows.length === 0) {
          setError("冇員工數據，請先添加員工。");
          setLoading(false);
          return;
        }

        const me = rows.find(r => r.id === user?.employeeId) || rows[0];
        console.log("匹配到的員工:", me); // 除錯用

        setEmp(me);

        try {
          const calcResult = calc({
            emp: me,
            period,
            otHours: 0,
            shDays: 0,
            noPayLeaveDays: 0,
            tipPay: 0,
            m5Tax: -1
          });
          console.log("計算結果:", calcResult); // 除錯用
          setResult(calcResult);
        } catch (calcErr: any) {
          console.error("計算薪資時出錯:", calcErr);
          setError("計算薪資失敗：" + (calcErr.message || "未知錯誤"));
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("獲取員工數據失敗:", err);
        setError("獲取員工數據失敗，請檢查網絡或重新登入。");
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [user, period]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">我的糧單</h1>
        <button onClick={logout} className="text-sm text-gray-600 underline">登出</button>
      </div>

      {loading && <p className="text-gray-500">載入中...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && emp && result && (
        <div className="bg-white rounded shadow p-6 space-y-2">
          <div className="text-lg font-semibold">{emp.name} {emp.englishName ? `(${emp.englishName})` : ""}</div>
          <div className="text-sm text-gray-500">{emp.jobTitle} / {emp.department} / {period}</div>
          <hr className="my-3" />
          <Row label="底薪" v={fmt.format(result.emp.baseSalary)} />
          <Row label="固定津貼" v={fmt.format(result.emp.fixedAllowance)} />
          <Row label="總收入" v={fmt.format(result.gross)} />
          <Row label="M/5 職業稅" v={fmt.format(result.m5TaxCalc)} />
          <Row label="FSS 僱員" v={fmt.format(result.fssEmpCalc)} />
          <Row label="實收" v={fmt.format(result.net)} highlight />
        </div>
      )}

      {!loading && !error && (!emp || !result) && (
        <p className="text-gray-500">暫無數據，請確保員工資料完整。</p>
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
