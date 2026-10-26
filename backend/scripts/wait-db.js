import 'dotenv/config';
import pg from 'pg';

const maxRetries = 30;
const delayMs = 1500;

async function checkDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL non définie.');
    process.exit(1);
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const client = new pg.Client({ connectionString });
    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      console.log('✅ Base de données PostgreSQL connectée avec succès.');
      process.exit(0);
    } catch (err) {
      try { await client.end(); } catch (_) {}
      console.log(`⏳ Attente de PostgreSQL (tentative ${attempt}/${maxRetries}): ${err.message}`);
      if (attempt === maxRetries) {
        console.error('❌ Échec de la connexion à PostgreSQL.');
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

checkDb();
