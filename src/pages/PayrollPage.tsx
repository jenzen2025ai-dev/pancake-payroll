import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { calc } from '../lib/payroll'
import { exportCsv } from '../lib/exportCsv'
import { fmt } from '../lib/format'
import type { Employee, PayrollResult } from '../types'

export default function PayrollPage() {
  const { period } = useParams<{period:string}>()
  const [rows, setRows] = useState<PayrollResult[]>([])

  async function load() {
    if (!period) return
    const data = await api.payroll(period)
    setRows(data.map((d:any) => calc(d)))
  }

  useEffect(() => { load() }, [period])

  function update(idx: number, patch: Partial<PayrollResult>) {
    setRows(rs => rs.map((r,i) => i===idx ? calc({...r, ...patch}) : r))
  }

  async function save() {
    await api.savePayroll(period!, rows)
    alert('已儲存')
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{period} 糧單計算</h1>
        <div className="space-x-2 text-sm">
          <Link to="/admin" className="underline text-gray-600">返回</Link>
          <button onClick={save} className="bg-blue-600 text-white px-3 py-1 rounded">儲存</button>
          <button onClick={()=>exportCsv(rows, period!)} className="bg-green-600 text-white px-3 py-1 rounded">匯出CSV</button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">員工</th>
              <th>OT時數</th><th>OT倍率</th><th>法定假日日數</th><th>無薪假日</th><th>小費/津貼</th>
              <th>M/5</th><th>FSS僱員</th>
              <th>總收入</th><th>稅</th><th>實收</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.emp.id} className="border-t">
                <td className="p-2">{r.emp.name}</td>
                <td><input className="w-20 border p-1" type="number" value={r.otHours??0} onChange={e=>update(i,{otHours:+e.target.value})} /></td>
                <td><input className="w-20 border p-1" type="number" step="0.1" value={r.otRate} onChange={e=>update(i,{otRate:+e.target.value})} /></td>
                <td><input className="w-20 border p-1" type="number" value={r.shDays??0} onChange={e=>update(i,{shDays:+e.target.value})} /></td>
                <td><input className="w-20 border p-1" type="number" value={r.noPayLeaveDays??0} onChange={e=>update(i,{noPayLeaveDays:+e.target.value})} /></td>
                <td><input className="w-24 border p-1" type="number" value={r.tipPay??0} onChange={e=>update(i,{tipPay:+e.target.value})} /></td>
                <td><input className="w-24 border p-1" type="number" value={r.m5Tax??-1} onChange={e=>update(i,{m5Tax:+e.target.value})} /></td>
                <td><input className="w-20 border p-1" type="number" value={r.fssEmp??30} onChange={e=>update(i,{fssEmp:+e.target.value})} /></td>
                <td>{fmt.format(r.gross)}</td>
                <td>{fmt.format(r.m5TaxCalc)}</td>
                <td className="font-semibold">{fmt.format(r.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
