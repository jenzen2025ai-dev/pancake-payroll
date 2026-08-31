import { db } from "./db.js";

const adminExists = db.prepare("SELECT id FROM users WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("admin", "admin123", "admin");
}

console.log("Seed done");
