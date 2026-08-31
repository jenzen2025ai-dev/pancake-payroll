import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PayrollPage from "./pages/PayrollPage";
import EmployeesPage from "./pages/EmployeesPage";

function Protected({ children, adminOnly }: { children: JSX.Element; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">頛銝?..</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/me" />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Protected><Navigate to={user?.role === "admin" ? "/admin" : "/me"} /></Protected>} />
          <Route path="/admin" element={<Protected adminOnly><AdminDashboard /></Protected>} />
          <Route path="/admin/payroll/:period" element={<Protected adminOnly><PayrollPage /></Protected>} />
          <Route path="/admin/employees" element={<Protected adminOnly><EmployeesPage /></Protected>} />
          <Route path="/me" element={<Protected><EmployeeDashboard /></Protected>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
