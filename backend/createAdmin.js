import 'dotenv/config';
import bcrypt from 'bcryptjs';
import db from './src/db.js';

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@immo-tulear.mg';
  let adminPassword = process.env.ADMIN_PASSWORD || 'admin@2026';
  if (adminPassword === 'WdLKhXgdm8bNUqnfGgNV' || adminPassword === 'admin123' || adminPassword === 'changez_moi') {
    adminPassword = 'admin@2026';
  }
  const adminRole = process.env.ADMIN_ROLE || 'admin';
  const adminName = 'Admin';

  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // 1. Vérifier si l'utilisateur avec adminEmail existe
    const { rows: existingUser } = await db.query("SELECT id, email FROM users WHERE email = $1", [adminEmail]);

    if (existingUser.length === 0) {
      await db.query(
        `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)`,
        [adminEmail, hashedPassword, adminName, adminRole]
      );
      console.log(`✅ Admin créé : ${adminEmail} (rôle : ${adminRole}).`);
    } else {
      await db.query(
        `UPDATE users SET password = $1, role = $2 WHERE email = $3`,
        [hashedPassword, adminRole, adminEmail]
      );
      console.log(`✅ Mot de passe mis à jour pour : ${adminEmail}`);
    }

    // 2. Mettre à jour également tout autre compte admin existant (ex: admin@immotulear.mg ou role = 'admin')
    const { rows: allAdmins } = await db.query(
      "SELECT id, email FROM users WHERE role = 'admin' OR email IN ('admin@immotulear.mg', 'admin@immo-tulear.mg')"
    );
    for (const user of allAdmins) {
      await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, user.id]);
      console.log(`✅ Mot de passe synchronisé pour : ${user.email} (id: ${user.id})`);
    }

    console.log(`\n🎉 Tous les comptes administrateurs ont désormais le mot de passe : ${adminPassword}`);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'admin :', error);
  } finally {
    process.exit(0);
  }
}

main();
