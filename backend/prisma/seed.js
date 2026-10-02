import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed de la base de données...');

  // 1. Créer l'administrateur
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@immotulear.mg' },
    update: {},
    create: {
      email: 'admin@immotulear.mg',
      password: hashedPassword,
      name: 'Admin ImmoTuléar',
      role: 'admin',
    },
  });
  console.log('👤 Admin créé (admin@immotulear.mg / admin123)');

  // 2. Nettoyer les propriétés existantes (optionnel, selon le comportement voulu)
  await prisma.property.deleteMany();

  // 3. Propriétés issues du frontend (propertiesData.js)
  const propertiesData = [
    {
      titre: 'Villa Moderne Andranomena',
      description: "Magnifique villa moderne avec jardin paysager, cuisine équipée et terrasse panoramique. Parfaite pour une famille souhaitant allier confort et modernité. Cette propriété exceptionnelle offre un cadre de vie idéal avec ses finitions de qualité et ses espaces lumineux.",
      prix: '850 000 000 Ar', priceNumeric: 850000000,
      type: 'Maison', location: 'Andranomena, Toliara',
      beds: 3, baths: 2, area: '120m²',
      status: 'available', actionType: 'sale',
      image: 'image/Maison.jpg',
      images: JSON.stringify(["image/Maison.jpg", "image/Vclaire.jpg", "image/Vclaire2.jpg"]),
      features: JSON.stringify(["Cuisine équipée moderne", "Jardin paysager", "Terrasse panoramique", "Garage couvert", "Système de sécurité", "Climatisation"]),
      details: JSON.stringify({ surface_terrain: "300m²", annee_construction: "2020", etages: "1", orientation: "Sud-Est", chauffage: "Climatisation", parking: "2 places" })
    },
    {
      titre: 'Maison Familiale Betania',
      description: "Spacieuse maison familiale avec grand salon, salle à manger séparée et jardin arboré. Quartier calme et résidentiel, idéal pour les familles. Architecture traditionnelle malgache revisitée avec tout le confort moderne.",
      prix: '1 200 000 000 Ar', priceNumeric: 1200000000,
      type: 'Maison', location: 'Betania, Toliara',
      beds: 4, baths: 3, area: '180m²',
      status: 'available', actionType: 'sale',
      image: 'image/Maison3.jpg',
      images: JSON.stringify(["image/Maison3.jpg", "image/Maison.jpg", "image/Vclaire3.jpg"]),
      features: JSON.stringify(["Grand salon lumineux", "Salle à manger séparée", "Jardin arboré", "Cuisine traditionnelle", "Véranda couverte", "Puits privé"]),
      details: JSON.stringify({ surface_terrain: "500m²", annee_construction: "2018", etages: "1", orientation: "Nord-Ouest", chauffage: "Naturel", parking: "3 places" })
    },
    {
      titre: 'Terrain Constructible Ankiembe',
      description: "Terrain plat et entièrement viabilisé, parfait pour construction résidentielle. Proche des commodités, accès facile et sécurisé. Idéal pour projet de construction de villa ou maison familiale.",
      prix: '500 000 000 Ar', priceNumeric: 500000000,
      type: 'Terrain', location: 'Ankiembe, Toliara',
      beds: null, baths: null, area: '500m²',
      status: 'available', actionType: 'sale',
      image: 'image/terrain.jpg',
      images: JSON.stringify(["image/terrain.jpg", "image/terrain2.jpg", "image/terrain3.jpeg"]),
      features: JSON.stringify(["Terrain plat", "Entièrement viabilisé", "Accès sécurisé", "Proche commodités", "Électricité disponible", "Eau courante"]),
      details: JSON.stringify({ surface_terrain: "500m²", zone: "Résidentielle", acces: "Route goudronnée", viabilisation: "Complète", constructibilite: "100%", orientation: "Plein Sud" })
    },
    {
      titre: 'Appartement Centre-Ville',
      description: "Bel appartement meublé au cœur de la ville. Proche de tous commerces et services. Parfait pour expatriés ou jeunes professionnels cherchant un logement pratique et bien situé.",
      prix: '350 000 Ar/mois', priceNumeric: 350000,
      type: 'Appartement', location: 'Centre-ville, Toliara',
      beds: 2, baths: 1, area: '80m²',
      status: 'available', actionType: 'rent',
      image: 'image/Alouer.jpg',
      images: JSON.stringify(["image/Alouer.jpg", "image/Alouer2.jpg", "image/Alouer3.jpg"]),
      features: JSON.stringify(["Entièrement meublé", "Centre-ville", "Proche commerces", "Balcon", "Internet inclus", "Sécurisé"]),
      details: JSON.stringify({ etage: "2ème étage", ascenseur: "Non", meuble: "Oui", charges: "50 000 Ar/mois", caution: "2 mois de loyer", disponibilite: "Immédiate" })
    }
  ];

  for (const p of propertiesData) {
    await prisma.property.create({ data: p });
  }
  console.log(`🏠 ${propertiesData.length} propriétés créées`);

  // 4. Contacts d'exemple
  await prisma.contact.createMany({
    data: [
      { name: 'Jean Dupont', email: 'jean@example.com', subject: 'Demande visite', message: 'Je suis intéressé par la villa Andranomena.', status: 'new' },
      { name: 'Marie Rakoto', email: 'marie@example.com', subject: 'Information terrain', message: 'Le terrain Ankiembe est-il négociable ?', status: 'read' },
    ]
  });
  console.log('✉️ Contacts de test créés');

  console.log('✅ Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
