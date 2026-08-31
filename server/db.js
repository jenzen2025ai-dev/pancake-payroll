import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");
fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, "payroll.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT "employee",
    employeeId INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    englishName TEXT,
    jobTitle TEXT,
    department TEXT,
    baseSalary REAL NOT NULL DEFAULT 0,
    fixedAllowance REAL NOT NULL DEFAULT 0,
    fssEmployer REAL DEFAULT 60,
    fssEmployee REAL DEFAULT 30,
    m5TaxTable TEXT DEFAULT "table1",
    joinedAt TEXT,
    status TEXT DEFAULT "active"
  );

  CREATE TABLE IF NOT EXISTS payroll_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employeeId INTEGER NOT NULL,
    period TEXT NOT NULL,
    otHours REAL DEFAULT 0,
    otRate REAL DEFAULT 1.2,
    shDays REAL DEFAULT 0,
    noPayLeaveDays REAL DEFAULT 0,
    tipPay REAL DEFAULT 0,
    m5Tax REAL DEFAULT -1,
    fssEmp REAL DEFAULT 30,
    UNIQUE(employeeId, period)
  );
`);
