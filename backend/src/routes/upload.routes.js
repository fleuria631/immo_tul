import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFiles, deleteFile } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads/');
  },
  filename: (req, file, cb) => {
    // Nom unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accepter uniquement les images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées!'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Toutes les routes d'upload sont protégées
router.use(authenticate);

// Permettre l'upload jusqu'à 5 fichiers à la fois sous le champ 'images'
router.post('/', upload.array('images', 5), uploadFiles);
router.delete('/:filename', deleteFile);

export default router;
