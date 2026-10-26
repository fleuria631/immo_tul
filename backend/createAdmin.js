import 'dotenv/config';
import bcrypt from 'bcryptjs';
import db from './src/db.js';

async function main() {
  const adminEmail = 'admin@immo-tulear.mg';
  const adminPassword = 'admin@2026';
  const adminRole = 'admin';

  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Formats d'emails pris en charge pour l'administrateur
    const adminEmails = [
      'admin@immo-tulear.mg',
      'admin@immotulear.mg',
      'admin@immotulear.com'
    ];

    for (const email of adminEmails) {
      const cleanEmail = email.trim().toLowerCase();
      const { rows } = await db.query(
        "SELECT id FROM users WHERE LOWER(TRIM(email)) = $1",
        [cleanEmail]
      );

      if (rows.length === 0) {
        await db.query(
          `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)`,
          [cleanEmail, hashedPassword, 'Admin ImmoTulear', adminRole]
        );
        console.log(`✅ Admin créé : ${cleanEmail}`);
      } else {
        await db.query(
          `UPDATE users SET password = $1, role = $2 WHERE id = $3`,
          [hashedPassword, adminRole, rows[0].id]
        );
        console.log(`✅ Mot de passe mis à jour pour : ${cleanEmail}`);
      }
    }

    // Mettre également à jour tout autre utilisateur ayant le rôle admin
    const { rows: otherAdmins } = await db.query(
      "SELECT id, email FROM users WHERE role = 'admin'"
    );
    for (const user of otherAdmins) {
      await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, user.id]);
    }

    console.log(`\n🎉 Compte actif : ${adminEmail} avec le mot de passe : ${adminPassword}`);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'admin :', error);
  } finally {
    process.exit(0);
  }
}

main();
