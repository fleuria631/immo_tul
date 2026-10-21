# =============================================================
#  Dockerfile — Backend ImmoTuléar (Node.js / Express)
# =============================================================

# --- Étape 1 : Installation des dépendances ---
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# --- Étape 2 : Image de production ---
FROM node:22-alpine

WORKDIR /app

# Sécurité : utilisateur non-root
RUN addgroup -S immo && adduser -S immo -G immo

# Copier les dépendances depuis l'étape précédente
COPY --from=deps /app/node_modules ./node_modules

# Copier le code source
COPY package.json ./
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY createAdmin.js ./

# Créer le dossier uploads avec les bonnes permissions
RUN mkdir -p uploads && chown -R immo:immo /app

USER immo

EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "src/server.js"]
