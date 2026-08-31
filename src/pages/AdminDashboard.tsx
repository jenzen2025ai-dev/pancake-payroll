import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { periods } from "../lib/periods";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">蝞∠??⊥?嗅</h1>
        <button onClick={logout} className="text-sm text-gray-600 underline">?餃</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/employees" className="block bg-white p-6 rounded shadow hover:bg-slate-50">
          <div className="font-semibold">?∪極鞈?</div>
          <div className="text-sm text-gray-500">?啣?/蝺刻摩?∪極???芥SS?/5銵?/div>
        </Link>
        <div className="bg-white p-6 rounded shadow">
          <div className="font-semibold mb-2">蝟扳?</div>
          <ul className="space-y-1 text-sm">
            {periods().map(p => (
              <li key={p}><Link className="text-blue-600 hover:underline" to={`/admin/payroll/${p}`}>{p}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-500">?餃頨怠?: {user?.username} ({user?.role})</div>
    </div>
  );
}
