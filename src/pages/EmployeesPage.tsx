import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Employee } from "../types";

export default function EmployeesPage() {
  const [rows, setRows] = useState<Employee[]>([]);

  useEffect(() => { api.employees().then(setRows); }, []);

  function update(i: number, patch: Partial<Employee>) {
    setRows(rs => rs.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  }

  async function save() {
    await api.saveEmployees(rows);
    alert("撌脣摮?);
  }

  function add() {
    const id = Math.max(0, ...rows.map(r => r.id)) + 1;
    setRows([...rows, { id, name: `?啣撌?{id}`, baseSalary: 15000, fixedAllowance: 0, fssEmployee: 30, m5TaxTable: "table1", status: "active" }]);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">?∪極鞈?</h1>
        <div className="space-x-2">
          <button onClick={add} className="bg-blue-600 text-white px-3 py-1 rounded">?啣?</button>
          <button onClick={save} className="bg-green-600 text-white px-3 py-1 rounded">?脣?</button>
        </div>
      </div>
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">憪?</th><th>?望???/th><th>?瑚?</th><th>?券?</th>
              <th>摨</th><th>?箏?瘣亥票</th><th>FSS?勗</th><th>M/5銵?/th><th>???/th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-t">
                <td className="p-2"><input className="border p-1" value={r.name} onChange={e => update(i, { name: e.target.value })} /></td>
                <td><input className="border p-1" value={r.englishName ?? ""} onChange={e => update(i, { englishName: e.target.value })} /></td>
                <td><input className="border p-1" value={r.jobTitle ?? ""} onChange={e => update(i, { jobTitle: e.target.value })} /></td>
                <td><input className="border p-1" value={r.department ?? ""} onChange={e => update(i, { department: e.target.value })} /></td>
                <td><input className="w-24 border p-1" type="number" value={r.baseSalary} onChange={e => update(i, { baseSalary: +e.target.value })} /></td>
                <td><input className="w-24 border p-1" type="number" value={r.fixedAllowance} onChange={e => update(i, { fixedAllowance: +e.target.value })} /></td>
                <td><input className="w-20 border p-1" type="number" value={r.fssEmployee ?? 30} onChange={e => update(i, { fssEmployee: +e.target.value })} /></td>
                <td>
                  <select className="border p-1" value={r.m5TaxTable ?? "table1"} onChange={e => update(i, { m5TaxTable: e.target.value as any })}>
                    <option value="table1">銵?</option>
                    <option value="table2">銵?</option>
                  </select>
                </td>
                <td>
                  <select className="border p-1" value={r.status ?? "active"} onChange={e => update(i, { status: e.target.value as any })}>
                    <option value="active">?刻</option>
                    <option value="inactive">?Ｚ</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
