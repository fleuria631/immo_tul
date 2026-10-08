import 'dotenv/config';
import bcrypt from 'bcryptjs';
import db from './src/db.js';

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@immotulear.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminRole = process.env.ADMIN_ROLE || 'admin';
  const adminName = 'Admin';

  try {
    const { rows: countRows } = await db.query("SELECT COUNT(*) FROM users WHERE email = $1", [adminEmail]);
    const count = parseInt(countRows[0].count);

    if (count === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await db.query(
        `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)`,
        [adminEmail, hashedPassword, adminName, adminRole]
      );
      console.log(`Admin cree : ${adminEmail} / ${adminPassword} (Role: ${adminRole})`);
    } else {
      console.log(`L'admin (${adminEmail}) existe deja.`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

main();
