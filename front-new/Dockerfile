# =============================================================
#  Dockerfile — Frontend ImmoTuléar (React / Vite + Nginx)
# =============================================================

# --- Étape 1 : Installation des dépendances ---
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# --- Étape 2 : Build de l'application ---
FROM node:22-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Les variables VITE_* sont intégrées au build
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# --- Étape 3 : Serveur Nginx de production ---
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 5005

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5005/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
