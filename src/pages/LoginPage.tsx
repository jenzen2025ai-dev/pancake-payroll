import { useState } from "react";
import { useAuth } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(u, p);
      nav("/");
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96 space-y-4">
        <h1 className="text-xl font-bold">瞉喲?蝟批蝟餌絞 ?餃</h1>
        <input className="border w-full p-2 rounded" placeholder="撣唾?" value={u} onChange={e => setU(e.target.value)} />
        <input className="border w-full p-2 rounded" type="password" placeholder="撖Ⅳ" value={p} onChange={e => setP(e.target.value)} />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button className="bg-blue-600 text-white w-full p-2 rounded">?餃</button>
        <div className="text-xs text-gray-500">皜祈岫: admin / admin123 ??FT0002 / emp123</div>
      </form>
    </div>
  );
}
