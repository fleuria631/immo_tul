// Gestionnaire global d'erreurs
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur:', err.message);

  // Erreurs Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Cette valeur existe déjà', field: err.meta?.target });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Ressource non trouvée' });
  }

  // Erreurs de validation
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON invalide dans le corps de la requête' });
  }

  // Erreur Multer
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Fichier trop volumineux (max 5 Mo)' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Trop de fichiers envoyés (max 5)' });
  }

  // Erreur par défaut
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Erreur interne du serveur' : err.message,
  });
};
