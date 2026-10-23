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

  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // S'assurer que les deux formats d'email (avec et sans tiret) existent avec le mot de passe
    const adminEmails = Array.from(new Set(['admin@immo-tulear.mg', 'admin@immotulear.mg', adminEmail]));

    for (const email of adminEmails) {
      const { rows } = await db.query("SELECT id FROM users WHERE email = $1", [email]);
      if (rows.length === 0) {
        await db.query(
          `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)`,
          [email, hashedPassword, 'Admin ImmoTulear', adminRole]
        );
        console.log(`✅ Admin créé : ${email}`);
      } else {
        await db.query(
          `UPDATE users SET password = $1, role = $2 WHERE id = $3`,
          [hashedPassword, adminRole, rows[0].id]
        );
        console.log(`✅ Mot de passe mis à jour pour : ${email}`);
      }
    }

    // Mettre à jour tout autre compte ayant le rôle admin
    const { rows: otherAdmins } = await db.query(
      "SELECT id, email FROM users WHERE role = 'admin'"
    );
    for (const user of otherAdmins) {
      await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, user.id]);
    }

    console.log(`\n🎉 Tous les comptes administrateurs ont désormais le mot de passe : ${adminPassword}`);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'admin :', error);
  } finally {
    process.exit(0);
  }
}

main();
