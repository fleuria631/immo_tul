# =============================================================
#  Dockerfile — Backend ImmoTuléar (Node.js / Express)
#  Multi-stage build optimisé et sécurisé
# =============================================================

# --- Étape 1 : Dépendances de production ---
FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# --- Étape 2 : Image finale de production ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Sécurité : utilisateur non-root
RUN addgroup -S immo && adduser -S immo -G immo

# Dépendances de production
COPY --from=dependencies /app/node_modules ./node_modules

# Code applicatif
COPY package.json ./
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY createAdmin.js ./
COPY docker-entrypoint.sh ./

# Permissions du dossier uploads et du script d'entrée
RUN mkdir -p uploads && chown -R immo:immo /app && chmod +x /app/docker-entrypoint.sh

USER immo

EXPOSE 3001

HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health > /dev/null 2>&1 || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "src/server.js"]
