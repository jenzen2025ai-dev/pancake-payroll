import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Employee } from '../types'
import { fmt } from '../lib/format'

export default function EmployeesPage() {
  const [rows, setRows] = useState<Employee[]>([])
  useEffect(()=>{ api.employees().then(setRows) }, [])

  function update(i:number, patch:Partial<Employee>) {
    setRows(rs => rs.map((r,idx)=> idx===i ? {...r,...patch} : r))
  }

  async function save() { await api.saveEmployees(rows); alert('已儲存') }
  function add() {
    const id = Math.max(0,...rows.map(r=>r.id)) + 1
    setRows([...rows, { id, name:`新員工${id}`, baseSalary:15000, fixedAllowance:0, fssEmployee:30, m5TaxTable:'table1', status:'active' }])
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">員工資料</h1>
        <div class="space-x-2">
          <button onClick={add} className="bg-blue-600 text-white px-3 py-1 rounded">新增</button>
          <button onClick={save} className="bg-green-600 text-white px-3 py-1 rounded">儲存</button>
        </div>
      </div>
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100"><tr>
            <th class="p-2 text-left">姓名</th><th>英文名</th><th>職位</th><th>部門</th>
            <th>底薪</th><th>固定津貼</th><th>FSS僱員</th><th>M/5表</th><th>狀態</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.id} class="border-t">
                <td class="p-2"><input class="border p-1" value={r.name} onChange={e=>update(i,{name:e.target.value})} /></td>
                <td><input class="border p-1" value={r.englishName??''} onChange={e=>update(i,{englishName:e.target.value})} /></td>
                <td><input class="border p-1" value={r.jobTitle??''} onChange={e=>update(i,{jobTitle:e.target.value})} /></td>
                <td><input class="border p-1" value={r.department??''} onChange={e=>update(i,{department:e.target.value})} /></td>
                <td><input class="w-24 border p-1" type="number" value={r.baseSalary} onChange={e=>update(i,{baseSalary:+e.target.value})} /></td>
                <td><input class="w-24 border p-1" type="number" value={r.fixedAllowance} onChange={e=>update(i,{fixedAllowance:+e.target.value})} /></td>
                <td><input class="w-20 border p-1" type="number" value={r.fssEmployee??30} onChange={e=>update(i,{fssEmployee:+e.target.value})} /></td>
                <td>
                  <select class="border p-1" value={r.m5TaxTable??'table1'} onChange={e=>update(i,{m5TaxTable:e.target.value as any})}>
                    <option value="table1">表1</option><option value="table2">表2</option>
                  </select>
                </td>
                <td>
                  <select class="border p-1" value={r.status??'active'} onChange={e=>update(i,{status:e.target.value as any})}>
                    <option value="active">在職</option><option value="inactive">離職</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
