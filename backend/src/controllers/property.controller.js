import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/properties — Liste publique avec filtres, tri et pagination
export const getAll = async (req, res, next) => {
  try {
    const { type, actionType, status, location, search, priceMin, priceMax, beds, sort, page = 1, limit = 12 } = req.query;

    const where = {};
    if (type) where.type = type;
    if (actionType) where.actionType = actionType;
    if (status) where.status = status;
    if (location) where.location = { contains: location };
    if (search) {
      where.OR = [
        { titre: { contains: search } },
        { location: { contains: search } },
        { description: { contains: search } },
        { type: { contains: search } }
      ];
    }
    if (beds) where.beds = { gte: parseInt(beds) };
    if (priceMin || priceMax) {
      where.priceNumeric = {};
      if (priceMin) where.priceNumeric.gte = parseFloat(priceMin);
      if (priceMax) where.priceNumeric.lte = parseFloat(priceMax);
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { priceNumeric: 'asc' };
    else if (sort === 'price-desc') orderBy = { priceNumeric: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [properties, total] = await Promise.all([
      prisma.property.findMany({ where, orderBy, skip, take: parseInt(limit) }),
      prisma.property.count({ where }),
    ]);

    // Parser les champs JSON
    const parsed = properties.map(p => ({
      ...p,
      features: JSON.parse(p.features),
      details: JSON.parse(p.details),
      images: JSON.parse(p.images),
    }));

    res.json({
      properties: parsed,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/properties/stats — Compteurs publics
export const getStats = async (req, res, next) => {
  try {
    const [totalSale, totalRent, byType] = await Promise.all([
      prisma.property.count({ where: { actionType: 'sale' } }),
      prisma.property.count({ where: { actionType: 'rent' } }),
      prisma.property.groupBy({ by: ['type'], _count: true }),
    ]);
    res.json({ totalSale, totalRent, byType });
  } catch (error) {
    next(error);
  }
};

// GET /api/properties/:id — Détail + incrément vues
export const getById = async (req, res, next) => {
  try {
    const property = await prisma.property.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!property) {
      return res.status(404).json({ error: 'Propriété non trouvée' });
    }

    // Incrémenter les vues
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.stats.upsert({
      where: { id: -1 }, // force create
      create: { propertyId: property.id, views: 1, date: today },
      update: { views: { increment: 1 } },
    }).catch(() => {
      // En cas d'erreur d'upsert, créer directement
      return prisma.stats.create({ data: { propertyId: property.id, views: 1, date: today } });
    });

    res.json({
      ...property,
      features: JSON.parse(property.features),
      details: JSON.parse(property.details),
      images: JSON.parse(property.images),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/properties — Créer une propriété (authentifié)
export const create = async (req, res, next) => {
  try {
    const { titre, description, prix, priceNumeric, type, location, beds, baths, area, status, actionType, features, details, images, image } = req.body;

    const property = await prisma.property.create({
      data: {
        titre, description, prix,
        priceNumeric: parseFloat(priceNumeric),
        type, location,
        beds: beds ? parseInt(beds) : null,
        baths: baths ? parseInt(baths) : null,
        area, status: status || 'available', actionType,
        features: JSON.stringify(features || []),
        details: JSON.stringify(details || {}),
        images: JSON.stringify(images || []),
        image: image || '',
      },
    });

    res.status(201).json({
      ...property,
      features: JSON.parse(property.features),
      details: JSON.parse(property.details),
      images: JSON.parse(property.images),
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/properties/:id — Modifier une propriété (authentifié)
export const update = async (req, res, next) => {
  try {
    const { features, details, images, beds, baths, priceNumeric, ...rest } = req.body;
    const data = { ...rest };

    if (features) data.features = JSON.stringify(features);
    if (details) data.details = JSON.stringify(details);
    if (images) data.images = JSON.stringify(images);
    if (beds !== undefined) data.beds = beds ? parseInt(beds) : null;
    if (baths !== undefined) data.baths = baths ? parseInt(baths) : null;
    if (priceNumeric !== undefined) data.priceNumeric = parseFloat(priceNumeric);

    const property = await prisma.property.update({
      where: { id: parseInt(req.params.id) },
      data,
    });

    res.json({
      ...property,
      features: JSON.parse(property.features),
      details: JSON.parse(property.details),
      images: JSON.parse(property.images),
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/properties/:id — Supprimer (admin uniquement)
export const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.stats.deleteMany({ where: { propertyId: id } });
    await prisma.property.delete({ where: { id } });
    res.json({ message: 'Propriété supprimée' });
  } catch (error) {
    next(error);
  }
};
