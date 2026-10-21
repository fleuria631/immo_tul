# =============================================================
#  Dockerfile — Frontend ImmoTuléar (React / Vite + serve)
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
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# --- Étape 3 : Servir avec "serve" (léger) ---
FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

# Copier le build
COPY --from=build /app/dist ./dist

# Sécurité : utilisateur non-root
RUN addgroup -S immo && adduser -S immo -G immo && chown -R immo:immo /app
USER immo

EXPOSE 5999

# serve -s = mode SPA (redirige tout vers index.html)
CMD ["serve", "-s", "dist", "-l", "5999"]
