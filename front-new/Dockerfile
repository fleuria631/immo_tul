# =============================================================
#  Dockerfile — Frontend ImmoTuléar (React SPA + Nginx)
#  Multi-stage build : Node.js builder + Nginx Alpine runner
# =============================================================

# --- Étape 1 : Dépendances ---
FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# --- Étape 2 : Compilation des assets Vite ---
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Argument d'URL API injecté au moment du build Vite
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# --- Étape 3 : Serveur Nginx Alpine de production ---
FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 5005

HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5005/ > /dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
