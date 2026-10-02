import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/contacts — Envoyer un message (public)
export const create = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, propertyId } = req.body;
    const contact = await prisma.contact.create({
      data: {
        name, email, phone, subject, message,
        propertyId: propertyId ? parseInt(propertyId) : null,
      },
    });

    // Incrémenter le compteur de demandes si lié à une propriété
    if (propertyId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await prisma.stats.create({
        data: { propertyId: parseInt(propertyId), inquiries: 1, date: today },
      }).catch(() => {});
    }

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

// GET /api/contacts — Liste des messages (authentifié)
export const getAll = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit),
        include: { property: { select: { id: true, titre: true, type: true } } },
      }),
      prisma.contact.count({ where }),
    ]);

    res.json({
      contacts,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/contacts/:id — Détail d'un message (marque comme lu)
export const getById = async (req, res, next) => {
  try {
    const contact = await prisma.contact.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'read' },
      include: { property: true },
    });
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

// PUT /api/contacts/:id/status — Changer le statut
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide (new, read, replied)' });
    }
    const contact = await prisma.contact.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/contacts/:id — Supprimer un message (admin)
export const remove = async (req, res, next) => {
  try {
    await prisma.contact.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Message supprimé' });
  } catch (error) {
    next(error);
  }
};
