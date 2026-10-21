import { assertEnv } from './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import propertyRoutes from './routes/property.routes.js';
import contactRoutes from './routes/contact.routes.js';
import statsRoutes from './routes/stats.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

assertEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware globaux ---
app.use(helmet({ crossOriginResourcePolicy: false }));
const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = rawFrontendUrl.split(',').map((u) => u.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Requêtes sans header Origin (curl, server-to-server, same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Fichiers statiques (uploads) ---
const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(uploadDir));

// --- Routes API ---
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// --- Route de santé ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ImmoTuléar API fonctionne', timestamp: new Date().toISOString() });
});

// --- Gestion des erreurs ---
app.use(errorHandler);

// --- Démarrage du serveur ---
app.listen(PORT, () => {
  console.log(` Serveur ImmoTuléar démarré sur http://localhost:${PORT}`);
  console.log(` API disponible sur http://localhost:${PORT}/api`);
});
