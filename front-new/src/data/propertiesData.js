/**
 * Modèle de données centralisé pour toutes les propriétés immobilières.
 * Source unique de vérité utilisée par tous les composants React.
 */

const propertiesData = [
    {
        id: "1",
        Image: 'image/Maison.jpg',
        prix: '850 000 000 Ar',
        priceNumeric: 850000000,
        type: 'Maison',
        titre: 'Villa Moderne Andranomena',
        location: 'Andranomena, Toliara',
        description: "Magnifique villa moderne avec jardin paysager, cuisine équipée et terrasse panoramique. Parfaite pour une famille souhaitant allier confort et modernité. Cette propriété exceptionnelle offre un cadre de vie idéal avec ses finitions de qualité et ses espaces lumineux.",
        beds: '3',
        baths: '2',
        area: '120m²',
        status: 'available',
        actionType: 'sale',
        images: [
            "image/Maison.jpg",
            "image/Vclaire.jpg",
            "image/Vclaire2.jpg"
        ],
        features: [
            "Cuisine équipée moderne",
            "Jardin paysager",
            "Terrasse panoramique",
            "Garage couvert",
            "Système de sécurité",
            "Climatisation"
        ],
        details: {
            surface_terrain: "300m²",
            annee_construction: "2020",
            etages: "1",
            orientation: "Sud-Est",
            chauffage: "Climatisation",
            parking: "2 places"
        }
    },
    {
        id: "2",
        Image: 'image/Maison3.jpg',
        prix: '1 200 000 000 Ar',
        priceNumeric: 1200000000,
        type: 'Maison',
        titre: 'Maison Familiale Betania',
        location: 'Betania, Toliara',
        description: "Spacieuse maison familiale avec grand salon, salle à manger séparée et jardin arboré. Quartier calme et résidentiel, idéal pour les familles. Architecture traditionnelle malgache revisitée avec tout le confort moderne.",
        beds: '4',
        baths: '3',
        area: '180m²',
        status: 'available',
        actionType: 'sale',
        images: [
            "image/Maison3.jpg",
            "image/Maison.jpg",
            "image/Vclaire3.jpg"
        ],
        features: [
            "Grand salon lumineux",
            "Salle à manger séparée",
            "Jardin arboré",
            "Cuisine traditionnelle",
            "Véranda couverte",
            "Puits privé"
        ],
        details: {
            surface_terrain: "500m²",
            annee_construction: "2018",
            etages: "1",
            orientation: "Nord-Ouest",
            chauffage: "Naturel",
            parking: "3 places"
        }
    },
    {
        id: "3",
        Image: 'image/terrain.jpg',
        prix: '500 000 000 Ar',
        priceNumeric: 500000000,
        type: 'Terrain',
        titre: 'Terrain Constructible Ankiembe',
        location: 'Ankiembe, Toliara',
        description: "Terrain plat et entièrement viabilisé, parfait pour construction résidentielle. Proche des commodités, accès facile et sécurisé. Idéal pour projet de construction de villa ou maison familiale.",
        area: '500m²',
        status: 'available',
        actionType: 'sale',
        images: [
            "image/terrain.jpg",
            "image/terrain2.jpg",
            "image/terrain3.jpeg"
        ],
        features: [
            "Terrain plat",
            "Entièrement viabilisé",
            "Accès sécurisé",
            "Proche commodités",
            "Électricité disponible",
            "Eau courante"
        ],
        details: {
            surface_terrain: "500m²",
            zone: "Résidentielle",
            acces: "Route goudronnée",
            viabilisation: "Complète",
            constructibilite: "100%",
            orientation: "Plein Sud"
        }
    },
    {
        id: "4",
        Image: 'image/Vclaire.jpg',
        prix: '1 950 000 000 Ar',
        priceNumeric: 1950000000,
        type: 'Villa',
        titre: 'Villa Vue Mer Sarodrano',
        location: 'Sarodrano, Toliara',
        description: "Villa d'exception avec vue panoramique sur la mer. Piscine privée, garage double et finitions haut de gamme. Un véritable havre de paix avec accès direct à la plage et couchers de soleil spectaculaires.",
        beds: '5',
        baths: '3',
        area: '250m²',
        status: 'reserved',
        actionType: 'sale',
        images: [
            "image/Vclaire.jpg",
            "image/Vclaire2.jpg",
            "image/Vclaire3.jpg"
        ],
        features: [
            "Vue panoramique sur mer",
            "Piscine privée",
            "Accès direct plage",
            "Garage double",
            "Finitions haut de gamme",
            "Terrasse vue mer"
        ],
        details: {
            surface_terrain: "800m²",
            annee_construction: "2021",
            etages: "2",
            orientation: "Ouest (vue mer)",
            chauffage: "Climatisation centrale",
            parking: "4 places"
        }
    },
    {
        id: "5",
        Image: 'image/terrain2.jpg',
        prix: '750 000 000 Ar',
        priceNumeric: 750000000,
        type: 'Terrain',
        titre: 'Grand Terrain Mahavatse',
        location: 'Mahavatse, Toliara',
        description: "Vaste terrain en bordure de route principale. Idéal pour projet commercial ou résidentiel de grande envergure. Excellent investissement avec fort potentiel de développement.",
        area: '800m²',
        status: 'available',
        actionType: 'sale',
        images: [
            "image/terrain2.jpg",
            "image/terrain.jpg",
            "image/terrain3.jpeg"
        ],
        features: [
            "Bordure route principale",
            "Grande superficie",
            "Potentiel commercial",
            "Investissement rentable",
            "Zone en développement",
            "Accès facile"
        ],
        details: {
            surface_terrain: "800m²",
            zone: "Mixte (résidentiel/commercial)",
            acces: "Route nationale",
            viabilisation: "Partielle",
            constructibilite: "80%",
            orientation: "Nord-Sud"
        }
    },
    {
        id: "6",
        Image: 'image/Vclaire2.jpg',
        prix: '1 100 000 000 Ar',
        priceNumeric: 1100000000,
        type: 'Maison',
        titre: 'Maison Contemporaine Tanambao',
        location: 'Tanambao, Toliara',
        description: "Architecture contemporaine avec espaces ouverts, grande baie vitrée et jardin zen. Design moderne et fonctionnel pour un style de vie unique alliant tradition et modernité.",
        beds: '4',
        baths: '2',
        area: '160m²',
        status: 'available',
        actionType: 'sale',
        images: [
            "image/Vclaire2.jpg",
            "image/Maison.jpg",
            "image/Vclaire.jpg"
        ],
        features: [
            "Architecture contemporaine",
            "Espaces ouverts",
            "Grande baie vitrée",
            "Jardin zen",
            "Design moderne",
            "Éclairage LED"
        ],
        details: {
            surface_terrain: "400m²",
            annee_construction: "2022",
            etages: "1",
            orientation: "Sud",
            chauffage: "Pompe à chaleur",
            parking: "2 places"
        }
    },
    {
        id: "7",
        Image: 'image/Alouer.jpg',
        prix: '350 000 Ar/mois',
        priceNumeric: 350000,
        type: 'Appartement',
        titre: 'Appartement Centre-Ville',
        location: 'Centre-ville, Toliara',
        description: "Bel appartement meublé au cœur de la ville. Proche de tous commerces et services. Parfait pour expatriés ou jeunes professionnels cherchant un logement pratique et bien situé.",
        beds: '2',
        baths: '1',
        area: '80m²',
        status: 'available',
        actionType: 'rent',
        images: [
            "image/Alouer.jpg",
            "image/Alouer2.jpg",
            "image/Alouer3.jpg"
        ],
        features: [
            "Entièrement meublé",
            "Centre-ville",
            "Proche commerces",
            "Balcon",
            "Internet inclus",
            "Sécurisé"
        ],
        details: {
            etage: "2ème étage",
            ascenseur: "Non",
            meuble: "Oui",
            charges: "50 000 Ar/mois",
            caution: "2 mois de loyer",
            disponibilite: "Immédiate"
        }
    },
    {
        id: "8",
        Image: 'image/Alouer2.jpg',
        prix: '500 000 Ar/mois',
        priceNumeric: 500000,
        type: 'Villa',
        titre: 'Villa de Standing Tsimenatse',
        location: 'Tsimenatse, Toliara',
        description: "Villa de standing avec piscine et jardin tropical. Sécurisée 24h/24, idéale pour location longue durée. Tout confort inclus avec service de gardiennage et entretien.",
        beds: '3',
        baths: '2',
        area: '150m²',
        status: 'available',
        actionType: 'rent',
        images: [
            "image/Alouer2.jpg",
            "image/Vclaire.jpg",
            "image/Alouer.jpg"
        ],
        features: [
            "Piscine privée",
            "Jardin tropical",
            "Sécurité 24h/24",
            "Gardiennage inclus",
            "Entretien inclus",
            "Parking sécurisé"
        ],
        details: {
            surface_terrain: "600m²",
            meuble: "Partiellement",
            charges: "100 000 Ar/mois",
            caution: "3 mois de loyer",
            duree_min: "12 mois",
            disponibilite: "1er du mois"
        }
    },
    {
        id: "9",
        Image: 'image/Alouer3.jpg',
        prix: '280 000 Ar/mois',
        priceNumeric: 280000,
        type: 'Maison',
        titre: 'Maison Traditionnelle Anketa',
        location: 'Anketa, Toliara',
        description: "Charmante maison traditionnelle entièrement rénovée. Cour intérieure, cuisine moderne et ambiance authentique malgache. Très bien située dans un quartier calme et familial.",
        beds: '2',
        baths: '1',
        area: '90m²',
        status: 'available',
        actionType: 'rent',
        images: [
            "image/Alouer3.jpg",
            "image/Maison3.jpg",
            "image/Alouer2.jfif"
        ],
        features: [
            "Style traditionnel",
            "Entièrement rénovée",
            "Cour intérieure",
            "Cuisine moderne",
            "Quartier calme",
            "Proche écoles"
        ],
        details: {
            surface_terrain: "200m²",
            meuble: "Non",
            charges: "30 000 Ar/mois",
            caution: "2 mois de loyer",
            duree_min: "6 mois",
            disponibilite: "Négociable"
        }
    },
    {
        id: "10",
        Image: 'image/terrain3.jpeg',
        prix: '650 000 000 Ar',
        priceNumeric: 650000000,
        type: 'Terrain',
        titre: 'Terrain Premium Bord de Mer',
        location: 'Ifaty, Toliara',
        description: "Terrain exceptionnel en bord de mer avec accès direct à la plage. Idéal pour projet touristique ou villa de luxe. Vue imprenable sur le canal de Mozambique.",
        area: '600m²',
        status: 'available',
        actionType: 'sale',
        images: [
            "image/terrain3.jpeg",
            "image/terrain.jpg",
            "image/terrain2.jpg"
        ],
        features: [
            "Bord de mer",
            "Accès direct plage",
            "Vue canal de Mozambique",
            "Potentiel touristique",
            "Zone prisée",
            "Cadre exceptionnel"
        ],
        details: {
            surface_terrain: "600m²",
            zone: "Touristique",
            acces: "Route côtière",
            viabilisation: "Partielle",
            constructibilite: "70%",
            orientation: "Ouest (vue mer)"
        }
    },
    {
        id: "11",
        Image: 'image/Maison2.jfif',
        prix: '980 000 000 Ar',
        priceNumeric: 980000000,
        type: 'Maison',
        titre: 'Maison Coloniale Rénovée',
        location: 'Centre historique, Toliara',
        description: "Magnifique maison coloniale entièrement rénovée avec respect du patrimoine architectural. Charme d'antan et confort moderne réunis.",
        beds: '4',
        baths: '2',
        area: '200m²',
        status: 'available',
        actionType: 'sale',
        images: [
            "image/Maison2.jfif",
            "image/Maison.jpg",
            "image/Maison3.jpg"
        ],
        features: [
            "Style colonial",
            "Entièrement rénovée",
            "Patrimoine architectural",
            "Charme historique",
            "Confort moderne",
            "Quartier central"
        ],
        details: {
            surface_terrain: "450m²",
            annee_construction: "1950 (rénovée 2023)",
            etages: "1",
            orientation: "Est",
            chauffage: "Ventilation naturelle",
            parking: "2 places"
        }
    },
    {
        id: "12",
        Image: 'image/Alouer2.jfif',
        prix: '450 000 Ar/mois',
        priceNumeric: 450000,
        type: 'Villa',
        titre: 'Villa Meublée Haut Standing',
        location: 'Maninday, Toliara',
        description: "Villa entièrement meublée avec piscine, jardin tropical et garage. Quartier résidentiel sécurisé. Idéale pour expatriés ou cadres supérieurs.",
        beds: '4',
        baths: '3',
        area: '180m²',
        status: 'available',
        actionType: 'rent',
        images: [
            "image/Alouer2.jfif",
            "image/Vclaire.jpg",
            "image/Vclaire2.jpg"
        ],
        features: [
            "Entièrement meublée",
            "Piscine privée",
            "Jardin tropical",
            "Garage",
            "Quartier sécurisé",
            "Tout confort"
        ],
        details: {
            surface_terrain: "500m²",
            meuble: "Oui",
            charges: "80 000 Ar/mois",
            caution: "3 mois de loyer",
            duree_min: "12 mois",
            disponibilite: "Immédiate"
        }
    }
];

// === Fonctions utilitaires pour accéder aux données ===

/**
 * Retourne toutes les propriétés
 */
export const getAllProperties = () => propertiesData;

/**
 * Retourne une propriété par son ID
 */
export const getPropertyById = (id) => propertiesData.find(p => p.id === id);

/**
 * Retourne les propriétés filtrées par type d'action (sale/rent)
 */
export const getPropertiesByAction = (actionType) => 
    propertiesData.filter(p => p.actionType === actionType);

/**
 * Retourne les propriétés à vendre
 */
export const getPropertiesForSale = () => getPropertiesByAction('sale');

/**
 * Retourne les propriétés à louer
 */
export const getPropertiesForRent = () => getPropertiesByAction('rent');

/**
 * Retourne les N premières propriétés (pour la page d'accueil)
 */
export const getFeaturedProperties = (count = 12) => propertiesData.slice(0, count);

export default propertiesData;
