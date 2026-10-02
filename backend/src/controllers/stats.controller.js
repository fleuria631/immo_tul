import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/stats/dashboard
export const dashboard = async (req, res, next) => {
  try {
    const [
      totalProperties,
      totalContacts,
      newContacts,
      propertiesByType,
      propertiesByAction,
      recentProperties
    ] = await Promise.all([
      prisma.property.count(),
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'new' } }),
      prisma.property.groupBy({ by: ['type'], _count: true }),
      prisma.property.groupBy({ by: ['actionType'], _count: true }),
      prisma.property.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, titre: true, type: true, priceNumeric: true, actionType: true, status: true, createdAt: true }
      })
    ]);

    // Aggregate views from stats
    const stats = await prisma.stats.aggregate({
      _sum: { views: true, inquiries: true }
    });

    res.json({
      overview: {
        totalProperties,
        totalContacts,
        newContacts,
        totalViews: stats._sum.views || 0,
        totalInquiries: stats._sum.inquiries || 0
      },
      propertiesByType,
      propertiesByAction,
      recentProperties
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/stats/property/:id
export const propertyStats = async (req, res, next) => {
  try {
    const propertyId = parseInt(req.params.id);
    
    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, titre: true }
    });

    if (!property) {
      return res.status(404).json({ error: 'Propriété non trouvée' });
    }

    const stats = await prisma.stats.findMany({
      where: { propertyId },
      orderBy: { date: 'asc' },
      take: 30 // Last 30 days
    });

    res.json({
      property,
      history: stats,
      totals: stats.reduce((acc, curr) => ({
        views: acc.views + curr.views,
        inquiries: acc.inquiries + curr.inquiries
      }), { views: 0, inquiries: 0 })
    });
  } catch (error) {
    next(error);
  }
};
