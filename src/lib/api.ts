async function j(r: Response) {
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || String(r.status));
  }
  return r.json();
}

export const api = {
  employees: () => fetch("/api/employees", { credentials: "include" }).then(j),
  saveEmployees: (rows: any[]) =>
    fetch("/api/employees", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rows)
    }).then(j),
  payroll: (period: string) =>
    fetch(`/api/payroll/${period}`, { credentials: "include" }).then(j),
  savePayroll: (period: string, rows: any[]) =>
    fetch(`/api/payroll/${period}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rows)
    }).then(j),
  me: () => fetch("/api/auth/me", { credentials: "include" }).then(j),
};
