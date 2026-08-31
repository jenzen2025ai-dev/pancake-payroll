// 自動建立預設管理員（如果冇用戶）
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
if (userCount.count === 0) {
  const bcrypt = await import("bcryptjs"); // 如果你用 bcrypt 加密
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)")
    .run("admin", hashedPassword, "admin");
  console.log("✅ 預設管理員已建立：admin / admin123");
}
