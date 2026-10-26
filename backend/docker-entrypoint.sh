#!/bin/sh
set -e

echo "================================================="
echo "  ImmoTuléar Backend — Démarrage du conteneur"
echo "================================================="

# 1. Attente de la base de données
node scripts/wait-db.js

# 2. Exécution idempotente des migrations / schéma
echo "🔄 Initialisation du schéma..."
node src/init-db.js

# 3. Synchronisation de l'administrateur
echo "👤 Synchronisation de l'administrateur..."
node createAdmin.js || true

# 4. Lancement de la commande principale (node src/server.js)
echo "🚀 Démarrage de l'API..."
exec "$@"
