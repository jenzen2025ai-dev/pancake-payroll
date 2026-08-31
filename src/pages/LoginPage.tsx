import { useState } from 'react'
import { useAuth } from '../lib/auth'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login(u, p)
      nav('/')
    } catch (e:any) { setErr(e.message) }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96 space-y-4">
        <h1 className="text-xl font-bold">澳門糧單系統 登入</h1>
        <input className="border w-full p-2 rounded" placeholder="帳號" value={u} onChange={e=>setU(e.target.value)} />
        <input className="border w-full p-2 rounded" type="password" placeholder="密碼" value={p} onChange={e=>setP(e.target.value)} />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button className="bg-blue-600 text-white w-full p-2 rounded">登入</button>
        <div className="text-xs text-gray-500">測試: admin / admin123 或 emp1 / emp123</div>
      </form>
    </div>
  )
}
