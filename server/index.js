import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(session({ secret: "macau-payroll", resave: false, saveUninitialized: false }));

app.get("/api/auth/me", (req, res) => {
  if (!req.session.userId) return res.status(401).json({});
  const u = db.prepare("SELECT id,username,role,employeeId FROM users WHERE id = ?").get(req.session.userId);
  res.json({ user: u });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const u = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!u || u.password !== password) return res.status(401).json({ error: "?餃憭望?" });
  req.session.userId = u.id;
  res.json({ user: { id: u.id, username: u.username, role: u.role, employeeId: u.employeeId } });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/employees", (req, res) => {
  if (!req.session.userId) return res.status(401).json({});
  const u = db.prepare("SELECT role,employeeId FROM users WHERE id = ?").get(req.session.userId);
  if (u.role === "admin") res.json(db.prepare("SELECT * FROM employees").all());
  else res.json(db.prepare("SELECT * FROM employees WHERE id = ?").all(u.employeeId));
});

app.post("/api/employees", (req, res) => {
  if (!req.session.userId) return res.status(401).json({});
  const u = db.prepare("SELECT role FROM users WHERE id = ?").get(req.session.userId);
  if (u.role !== "admin") return res.status(403).json({ error: "?⊥??? });
  const rows = req.body;
  for (const r of rows) {
    db.prepare("INSERT OR REPLACE INTO employees (id,name,englishName,jobTitle,department,baseSalary,fixedAllowance,fssEmployer,fssEmployee,m5TaxTable,joinedAt,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)").run(
      r.id, r.name, r.englishName, r.jobTitle, r.department, r.baseSalary, r.fixedAllowance, r.fssEmployer, r.fssEmployee, r.m5TaxTable, r.joinedAt, r.status
    );
  }
  res.json({ ok: true });
});

app.get("/api/payroll/:period", (req, res) => {
  if (!req.session.userId) return res.status(401).json({});
  const u = db.prepare("SELECT role,employeeId FROM users WHERE id = ?").get(req.session.userId);
  let emps = u.role === "admin"
    ? db.prepare("SELECT * FROM employees").all()
    : db.prepare("SELECT * FROM employees WHERE id = ?").all(u.employeeId);
  const results = emps.map(emp => {
    const rec = db.prepare("SELECT * FROM payroll_records WHERE employeeId = ? AND period = ?").get(emp.id, req.params.period);
    return {
      emp,
      period: req.params.period,
      otHours: rec?.otHours ?? 0,
      otRate: rec?.otRate ?? 1.2,
      shDays: rec?.shDays ?? 0,
      noPayLeaveDays: rec?.noPayLeaveDays ?? 0,
      tipPay: rec?.tipPay ?? 0,
      m5Tax: rec?.m5Tax ?? -1,
      fssEmp: rec?.fssEmp ?? 30
    };
  });
  res.json(results);
});

app.post("/api/payroll/:period", (req, res) => {
  if (!req.session.userId) return res.status(401).json({});
  const u = db.prepare("SELECT role FROM users WHERE id = ?").get(req.session.userId);
  if (u.role !== "admin") return res.status(403).json({ error: "?⊥??? });
  const insert = db.prepare("INSERT OR REPLACE INTO payroll_records (employeeId,period,otHours,otRate,shDays,noPayLeaveDays,tipPay,m5Tax,fssEmp) VALUES (?,?,?,?,?,?,?,?,?)");
  for (const r of req.body) {
    insert.run(r.emp.id, req.params.period, r.otHours, r.otRate, r.shDays, r.noPayLeaveDays, r.tipPay, r.m5Tax ?? -1, r.fssEmp ?? 30);
  }
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server on " + PORT));
