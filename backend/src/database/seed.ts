/**
 * Script de seed — lance avec : npx ts-node src/database/seed.ts
 * Peuple la base avec catégories, produits et services pour LUNARIA
 */
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

const U = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fit=crop&h=${h}`;

// ─── Schemas inline ──────────────────────────────────────────────────────
const CategorySchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    image: String,
    icon: String,
    isActive: Boolean,
    order: Number,
  },
  { timestamps: true },
);
const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    shortDescription: String,
    price: Number,
    comparePrice: Number,
    images: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [String],
    stock: Number,
    isAvailable: Boolean,
    isFeatured: Boolean,
    isArchived: Boolean,
    ratings: { average: Number, count: Number },
    weight: Number,
  },
  { timestamps: true },
);
const ServiceSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    shortDescription: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    basePrice: Number,
    priceNote: String,
    images: [String],
    includes: [String],
    options: [{ name: String, price: Number }],
    duration: String,
    isAvailable: Boolean,
    isArchived: Boolean,
    isFeatured: Boolean,
    ratings: { average: Number, count: Number },
  },
  { timestamps: true },
);
const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    password: String,
    role: String,
    isVerified: Boolean,
    isActive: Boolean,
    favorites: [String],
    otpCode: String,
    otpExpires: Date,
  },
  { timestamps: true },
);
const PromoSchema = new mongoose.Schema(
  {
    code: String,
    description: String,
    type: String,
    value: Number,
    minOrderAmount: Number,
    maxUses: Number,
    usedCount: Number,
    validUntil: Date,
    isActive: Boolean,
  },
  { timestamps: true },
);

const Category = mongoose.model('Category', CategorySchema);
const Product = mongoose.model('Product', ProductSchema);
const DecorationService = mongoose.model('DecorationService', ServiceSchema);
const User = mongoose.model('User', UserSchema);
const PromoCode = mongoose.model('PromoCode', PromoSchema);

// ─── Données ─────────────────────────────────────────────────────────────
const CATEGORIES_DATA = [
  {
    name: 'Mariage',
    slug: 'mariage',
    icon: '💍',
    image: U('1518621736915-f3b1c41bfd00'),
    order: 1,
    description: 'Décorations sompteuses pour le plus beau jour de votre vie',
  },
  {
    name: 'Saint-Valentin',
    slug: 'saint-valentin',
    icon: '❤️',
    image: U('1547592180-85f173990554'),
    order: 2,
    description: 'Créez une ambiance romantique inoubliable',
  },
  {
    name: 'Anniversaire',
    slug: 'anniversaire',
    icon: '🎂',
    image: U('1516802273409-68526ee1bdd6'),
    order: 3,
    description: 'Fêtez chaque anniversaire avec éclat',
  },
  {
    name: 'Fête des mères',
    slug: 'fete-des-meres',
    icon: '🌸',
    image: U('1490750967868-88df5691cc3c'),
    order: 4,
    description: 'Honorez la femme de votre vie',
  },
  {
    name: 'Fête des pères',
    slug: 'fete-des-peres',
    icon: '👑',
    image: U('1485546246426-f4b8b59c3b3e'),
    order: 5,
    description: 'Surprenez le héros de la famille',
  },
  {
    name: 'Baptême',
    slug: 'bapteme',
    icon: '🕊️',
    image: U('1519211726170-5b0aff3e9007'),
    order: 6,
    description: 'Un accueil tout doux pour le nouveau-né',
  },
  {
    name: 'Fiançailles',
    slug: 'fiancailles',
    icon: '💎',
    image: U('1464349095431-e9a21285b5f3'),
    order: 7,
    description: 'Préparez la plus belle surprise de votre vie',
  },
  {
    name: 'Romantique',
    slug: 'romantique',
    icon: '🕯️',
    image: U('1582657233272-66b9c5fa14a6'),
    order: 8,
    description: 'Décoration romantique pour vos nuits spéciales',
  },
];

const slug = (name: string, id: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-') +
  '-' +
  id.slice(-4);

async function seed() {
  await mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/lunaria',
  );
  console.log('✅ Connecté à MongoDB');

  // Nettoyer
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    DecorationService.deleteMany({}),
  ]);
  console.log('🗑️  Collections nettoyées');

  // Catégories
  const cats = await Category.insertMany(
    CATEGORIES_DATA.map((c) => ({ ...c, isActive: true })),
  );
  const catMap = Object.fromEntries(
    cats.map((c) => [(c as { slug: string }).slug, c._id]),
  );
  console.log(`📂 ${cats.length} catégories créées`);

  // Produits
  const now = Date.now();
  const products = [
    // Romantique
    {
      name: 'Kit Bougies LED Romantiques (10 pièces)',
      shortDescription:
        'Bougies à flamme vacillante, effet bougie réelle sans danger',
      description:
        "Créez une atmosphère romantique envoûtante avec ce kit de 10 bougies LED. Flamme vacillante ultra-réaliste, alimentation par piles, parfaites pour une décoration sans risque d'incendie.",
      price: 3500,
      comparePrice: 5000,
      images: [
        U('1519657338903-65af98c59b8b', 600, 600),
        U('1602028915047-37269d1a73f7', 600, 600),
      ],
      category: catMap['romantique'],
      tags: ['bougies', 'led', 'romantique', 'mariage'],
      stock: 50,
      isFeatured: true,
      ratings: { average: 4.8, count: 32 },
    },
    {
      name: 'Guirlande Lumineuse Dorée 10m',
      shortDescription: 'Guirlande led cuivre, 100 micro-ampoules chaleureuses',
      description:
        "Transformez n'importe quel espace avec cette guirlande lumineuse de 10 mètres en fil de cuivre. 100 micro-ampoules à lumière chaude créent une ambiance féerique. Idéale pour les mariages, chambres romantiques et fêtes.",
      price: 5500,
      images: [
        U('1482555670981-4de159d8553b', 600, 600),
        U('1545127398-14699f92334b', 600, 600),
      ],
      category: catMap['romantique'],
      tags: ['guirlande', 'led', 'dorée', 'féerique'],
      stock: 35,
      isFeatured: true,
      ratings: { average: 4.9, count: 47 },
    },
    {
      name: 'Pétales de Roses Rouges (500g)',
      shortDescription:
        'Vraies pétales de roses séchées, couleur rouge intense',
      description:
        'Créez un chemin de rose ou décorez votre lit avec ces véritables pétales de roses rouges. 500g de pétales séchés de qualité premium pour une décoration romantique inoubliable.',
      price: 4000,
      comparePrice: 5500,
      images: [
        U('1565538810643-b5bdb6cc1a5b', 600, 600),
        U('1464349095431-e9a21285b5f3', 600, 600),
      ],
      category: catMap['saint-valentin'],
      tags: ['roses', 'pétales', 'romantique', 'saint-valentin'],
      stock: 80,
      isFeatured: true,
      ratings: { average: 4.7, count: 28 },
    },
    {
      name: 'Ballon Cœur Géant Rouge 90cm',
      shortDescription: 'Ballon en forme de cœur XXL, qualité premium',
      description:
        "Un cœur géant pour une déclaration d'amour spectaculaire ! Ce ballon en latex de 90cm est parfait pour les Saint-Valentin, demandes en mariage et anniversaires romantiques.",
      price: 3000,
      images: [U('1530103862676-de8c9debad1d', 600, 600)],
      category: catMap['saint-valentin'],
      tags: ['ballon', 'coeur', 'saint-valentin', 'déclaration'],
      stock: 60,
      isFeatured: false,
      ratings: { average: 4.6, count: 15 },
    },
    {
      name: 'Photophore en Verre Doré (lot de 6)',
      shortDescription: 'Porte-bougies en verre soufflé, finition or',
      description:
        'Ces 6 photophores en verre soufflé à finition dorée apportent une touche luxueuse à votre table de mariage ou à votre décoration romantique. Compatible avec bougies chauffe-plat et LED.',
      price: 12000,
      comparePrice: 16000,
      images: [
        U('1519657338903-65af98c59b8b', 600, 600),
        U('1414235077428-338140e4d29b', 600, 600),
      ],
      category: catMap['mariage'],
      tags: ['photophore', 'verre', 'doré', 'mariage'],
      stock: 20,
      isFeatured: true,
      ratings: { average: 4.9, count: 22 },
    },
    {
      name: 'Coeur Lumineux LED 40cm',
      shortDescription: 'Décoration murale coeur en néon LED, câble USB',
      description:
        'Un coeur lumineux en LED de 40cm pour sublimer votre chambre ou votre table de cérémonie. Lumière chaude, alimentation USB, parfait pour les photos et la décoration.',
      price: 8500,
      images: [U('1607346704353-a82cec7b6fce', 600, 600)],
      category: catMap['saint-valentin'],
      tags: ['coeur', 'led', 'neon', 'décoration'],
      stock: 25,
      isFeatured: true,
      ratings: { average: 4.8, count: 19 },
    },
    // Mariage
    {
      name: 'Arche Fleurie Blanche (location)',
      shortDescription: 'Arche décorée de fleurs fraîches, pour cérémonie',
      description:
        'Magnifiez votre cérémonie de mariage avec cette arche entièrement décorée de fleurs blanches et de verdure. Location pour la journée, installation et reprise incluses.',
      price: 45000,
      images: [
        U('1523438885200-e635ba2c371e', 600, 600),
        U('1518621736915-f3b1c41bfd00', 600, 600),
      ],
      category: catMap['mariage'],
      tags: ['arche', 'fleurs', 'mariage', 'cérémonie'],
      stock: 3,
      isFeatured: true,
      ratings: { average: 5.0, count: 8 },
    },
    {
      name: 'Centre de Table Floral Mariage',
      shortDescription: 'Composition florale pour table de réception',
      description:
        "Élégant centre de table avec roses blanches, eucalyptus et boutons d'or. Composition fraîche préparée le jour J. Prix à la pièce.",
      price: 15000,
      comparePrice: 20000,
      images: [U('1414235077428-338140e4d29b', 600, 600)],
      category: catMap['mariage'],
      tags: ['centre de table', 'floral', 'mariage', 'roses'],
      stock: 15,
      isFeatured: false,
      ratings: { average: 4.7, count: 12 },
    },
    // Anniversaire
    {
      name: 'Kit Décoration Anniversaire Dorée',
      shortDescription: 'Ballons, banderoles, confettis — tout pour la fête !',
      description:
        'Kit complet pour une décoration d\'anniversaire mémorable : 20 ballons dorés et noirs, banderole "Joyeux Anniversaire", confettis étoiles, 2 ballons chiffres.',
      price: 9500,
      comparePrice: 13000,
      images: [
        U('1516802273409-68526ee1bdd6', 600, 600),
        U('1527529482837-4698179dc6ce', 600, 600),
      ],
      category: catMap['anniversaire'],
      tags: ['anniversaire', 'ballons', 'kit', 'doré'],
      stock: 40,
      isFeatured: true,
      ratings: { average: 4.6, count: 34 },
    },
    {
      name: 'Bannière Personnalisable',
      shortDescription: 'Bannière tissu "Happy Birthday" personnalisable',
      description:
        'Bannière en tissu de haute qualité, personnalisable avec le prénom du fêté. Dimensions 2m × 30cm, livraison en 48h.',
      price: 7000,
      images: [U('1516802273409-68526ee1bdd6', 600, 600)],
      category: catMap['anniversaire'],
      tags: ['bannière', 'anniversaire', 'personnalisable'],
      stock: 20,
      isFeatured: false,
      ratings: { average: 4.5, count: 11 },
    },
    // Fête des mères
    {
      name: 'Bouquet de 30 Roses Roses',
      shortDescription: 'Roses fraîches de première qualité, emballage élégant',
      description:
        'Offrez un magnifique bouquet de 30 roses fraîches de couleur rose tendre. Emballage cadeau avec ruban satin, carte message personnalisée incluse. Disponible le jour J.',
      price: 18000,
      comparePrice: 22000,
      images: [U('1490750967868-88df5691cc3c', 600, 600)],
      category: catMap['fete-des-meres'],
      tags: ['roses', 'bouquet', 'fête des mères', 'fleurs'],
      stock: 12,
      isFeatured: true,
      ratings: { average: 4.9, count: 26 },
    },
    // Baptême
    {
      name: 'Kit Décoration Baptême Bleu/Rose',
      shortDescription: 'Ballons, organza, guirlandes pastel pour baptême',
      description:
        "Kit complet pour la décoration d'un baptême. Disponible en bleu (garçon) ou rose (fille) : ballons, guirlandes, organza, chemin de table, porte-bougie.",
      price: 15000,
      images: [U('1519211726170-5b0aff3e9007', 600, 600)],
      category: catMap['bapteme'],
      tags: ['baptême', 'kit', 'pastel', 'bébé'],
      stock: 18,
      isFeatured: false,
      ratings: { average: 4.7, count: 9 },
    },
    // Fiançailles
    {
      name: 'Coffret Romantique "Oui Je le veux"',
      shortDescription: 'Bougies, pétales, photophores, champagne non inclus',
      description:
        'Créez la demande en mariage parfaite avec ce coffret : 6 bougies parfumées rose, 200g de pétales rouges, 4 photophores dorés, guirlande lumineuse 3m et tapis moelleux. Tout pour un moment magique.',
      price: 35000,
      comparePrice: 42000,
      images: [
        U('1464349095431-e9a21285b5f3', 600, 600),
        U('1519657338903-65af98c59b8b', 600, 600),
        U('1547592180-85f173990554', 600, 600),
      ],
      category: catMap['fiancailles'],
      tags: ['demande', 'fiançailles', 'romantique', 'coffret'],
      stock: 8,
      isFeatured: true,
      ratings: { average: 5.0, count: 14 },
    },
    // Bougies parfumées
    {
      name: 'Bougie Parfumée Rose & Oud (250g)',
      shortDescription: 'Cire végétale, fragrance rose et bois de oud',
      description:
        'Bougie artisanale en cire de soja 100% naturelle, parfum rose et bois de oud. 45h de combustion, mèche en coton, pot en verre réutilisable.',
      price: 6500,
      comparePrice: 8000,
      images: [U('1602028915047-37269d1a73f7', 600, 600)],
      category: catMap['romantique'],
      tags: ['bougie', 'parfumée', 'rose', 'oud', 'naturelle'],
      stock: 30,
      isFeatured: false,
      ratings: { average: 4.8, count: 21 },
    },
    {
      name: 'Coupe à Champagne Décorée (x2)',
      shortDescription:
        'Coupes dorées avec gravure rose, idéales pour les mariés',
      description:
        'Paire de coupes à champagne en verre soufflé à finition dorée avec décoration florale gravée. Parfaites pour le toast des mariés ou pour célébrer une demande en mariage.',
      price: 12000,
      images: [U('1510812431401-41d2bd2722f3', 600, 600)],
      category: catMap['mariage'],
      tags: ['coupe', 'champagne', 'mariage', 'dorée'],
      stock: 15,
      isFeatured: false,
      ratings: { average: 4.7, count: 7 },
    },
  ];

  const createdProducts = await Product.insertMany(
    products.map((p, i) => ({
      ...p,
      slug: slug(p.name, String(i) + now),
      isArchived: false,
      isAvailable: true,
    })),
  );
  console.log(`📦 ${createdProducts.length} produits créés`);

  // Services de décoration
  const services = [
    {
      name: 'Chambre Romantique Essentielle',
      shortDescription: "L'essentiel pour une nuit inoubliable",
      description:
        "Notre formule d'entrée en décoration romantique. En 1h30 nous transformons votre chambre avec bougies LED, pétales de roses, guirlandes lumineuses et une ambiance musicale douce. Parfaite pour la Saint-Valentin, les anniversaires ou simplement surprendre votre partenaire.",
      basePrice: 25000,
      priceNote: 'À partir de 25 000 FCFA',
      images: [U('1582657233272-66b9c5fa14a6'), U('1547592180-85f173990554')],
      category: catMap['romantique'],
      includes: [
        '20 bougies LED vacillantes',
        'Pétales de roses (300g)',
        'Guirlande lumineuse 5m',
        "Parfum d'ambiance",
        'Nappe romantique',
      ],
      options: [
        { name: 'Ajout bouquet de roses', price: 8000 },
        { name: 'Champagne offert', price: 12000 },
        { name: 'Musique personnalisée', price: 5000 },
      ],
      duration: "1h30 d'installation",
      isFeatured: true,
      ratings: { average: 4.9, count: 38 },
    },
    {
      name: 'Chambre Romantique Prestige',
      shortDescription: "L'expérience romantique ultime, tout inclus",
      description:
        "Notre formule premium pour une nuit d'exception. Décoration haut de gamme avec bougies en cire naturelle, rose fraîches, photophores dorés, rideau de guirlandes et service de champagne. Notre équipe s'occupe de tout, vous n'avez qu'à profiter.",
      basePrice: 65000,
      priceNote: 'Tout inclus · paiement en 2 fois possible',
      images: [
        U('1631049307264-da0ec9d70304'),
        U('1582657233272-66b9c5fa14a6'),
        U('1519657338903-65af98c59b8b'),
      ],
      category: catMap['romantique'],
      includes: [
        '40 bougies naturelles parfumées',
        'Bouquet de 20 roses fraîches',
        '500g pétales de roses',
        'Guirlandes 360° (15m)',
        '6 photophores dorés',
        'Champagne × 2',
        'Nappe velours rouge',
        "Musique d'ambiance",
        'Eau de roses',
      ],
      options: [
        { name: 'Ours en peluche géant', price: 8000 },
        { name: 'Chocolats Ferrero Rocher', price: 7000 },
        { name: 'Photos souvenir', price: 15000 },
      ],
      duration: "2h d'installation",
      isFeatured: true,
      ratings: { average: 5.0, count: 22 },
    },
    {
      name: 'Décoration Mariage Classique',
      shortDescription: 'Cérémonie et réception élégantes et intemporelles',
      description:
        "Une décoration de mariage blanche et dorée pour une cérémonie digne des plus beaux contes. Comprend la décoration de la salle de cérémonie et de la salle de réception. Devis personnalisé selon le nombre d'invités.",
      basePrice: 150000,
      priceNote: 'À partir de 150 000 FCFA selon invités',
      images: [
        U('1518621736915-f3b1c41bfd00'),
        U('1523438885200-e635ba2c371e'),
        U('1414235077428-338140e4d29b'),
      ],
      category: catMap['mariage'],
      includes: [
        'Arche florale blanche',
        'Chemin de fleurs (5m)',
        'Centres de table floraux (×10)',
        'Guirlandes de salle',
        'Photophores sur tables',
        'Nappe et serviettes assorties',
        'Panneau bienvenue personnalisé',
      ],
      options: [
        { name: 'Décoration voiture des mariés', price: 15000 },
        { name: 'Arche supplémentaire', price: 35000 },
        { name: 'Photobooth floral', price: 45000 },
      ],
      duration: 'Installation la veille',
      isFeatured: true,
      ratings: { average: 4.9, count: 15 },
    },
    {
      name: 'Décoration Anniversaire Festive',
      shortDescription: 'Une fête mémorable pour votre anniversaire',
      description:
        'Faites de votre anniversaire un moment inoubliable ! Décoration complète de votre salle avec ballons, guirlandes, centre de table, chemin de table et backdrop photo. Personnalisable aux couleurs de votre choix.',
      basePrice: 40000,
      priceNote: 'Pour 20 à 50 invités',
      images: [
        U('1516802273409-68526ee1bdd6'),
        U('1527529482837-4698179dc6ce'),
      ],
      category: catMap['anniversaire'],
      includes: [
        '50 ballons aux couleurs choisies',
        'Arche de ballons',
        'Banderole personnalisée',
        'Centre de table ×5',
        'Backdrop photo',
        'Chemin de table',
        'Confettis et paillettes',
      ],
      options: [
        { name: 'Gâteau décoré (sans garniture)', price: 25000 },
        { name: 'Ballons chiffres lumineux', price: 8000 },
        { name: 'Photobooth complet', price: 20000 },
      ],
      duration: "2h d'installation",
      isFeatured: false,
      ratings: { average: 4.8, count: 27 },
    },
    {
      name: 'Décoration Saint-Valentin',
      shortDescription: 'Surprenez votre partenaire avec une chambre de rêve',
      description:
        'Offrez une nuit de Saint-Valentin inoubliable avec notre décoration signature. Bougies, pétales, lumières douces et parfum de roses : nous transformons votre chambre ou votre salle de restaurant en paradis romantique.',
      basePrice: 35000,
      priceNote: 'Disponible du 12 au 15 Février',
      images: [
        U('1547592180-85f173990554'),
        U('1519741497674-611481863552'),
        U('1607346704353-a82cec7b6fce'),
      ],
      category: catMap['saint-valentin'],
      includes: [
        '30 bougies LED + 5 vraies bougies',
        'Pétales de roses rouges (500g)',
        'Coeur lumineux LED',
        'Guirlande cœur 3m',
        'Parfum rose',
        'Vin mousseux rosé',
      ],
      options: [
        { name: 'Peluche ours géant', price: 8000 },
        { name: 'Bouquet roses fraîches', price: 12000 },
        { name: 'Box chocolats fins', price: 9000 },
      ],
      duration: "1h30 d'installation",
      isFeatured: true,
      ratings: { average: 5.0, count: 31 },
    },
    {
      name: 'Décoration Baptême Doux',
      shortDescription: 'Accueil tout en douceur pour bébé',
      description:
        "Une décoration douce et poétique pour célébrer l'arrivée de bébé. Tons pastel, ballons en forme d'étoiles et d'animaux, organza et guirlandes délicates. Disponible en version bleu (garçon) ou rose (fille).",
      basePrice: 30000,
      priceNote: 'Pour 15 à 30 invités',
      images: [U('1519211726170-5b0aff3e9007')],
      category: catMap['bapteme'],
      includes: [
        '30 ballons pastel',
        "Arche ballons porte d'entrée",
        'Centre de table ×4',
        'Bannière personnalisée',
        'Chemin de table',
        'Organza et tulle',
      ],
      options: [
        { name: 'Porte photo personnalisé', price: 5000 },
        { name: 'Chandelier décoratif', price: 8000 },
      ],
      duration: "1h30 d'installation",
      isFeatured: false,
      ratings: { average: 4.8, count: 11 },
    },
    {
      name: 'Demande en Mariage Surprise',
      shortDescription: 'Orchestrez LA demande parfaite',
      description:
        "Votre demande en mariage mérite d'être parfaite. Notre équipe monte une mise en scène romantique complète : chemin de bougies, pétales en forme de cœur, guirlandes et champagne au frais. Nous nous éclipsons avant votre arrivée.",
      basePrice: 55000,
      priceNote: 'Secret garanti · 100% sur mesure',
      images: [
        U('1464349095431-e9a21285b5f3'),
        U('1519657338903-65af98c59b8b'),
        U('1510812431401-41d2bd2722f3'),
      ],
      category: catMap['fiancailles'],
      includes: [
        '50 bougies LED + 10 vraies',
        'Chemin de pétales rouges',
        'Guirlandes étoiles',
        'Bouquet de roses rouges',
        'Champagne × 2',
        'Peignoirs couple',
        'Musique personnalisée',
      ],
      options: [
        { name: 'Photographe (2h)', price: 40000 },
        { name: 'Drone vidéo', price: 35000 },
        { name: "Hôtesse d'accueil", price: 15000 },
      ],
      duration: "2h d'installation",
      isFeatured: true,
      ratings: { average: 5.0, count: 18 },
    },
  ];

  const createdServices = await DecorationService.insertMany(
    services.map((s, i) => ({
      ...s,
      slug: slug(s.name, String(i) + now + 1),
      isAvailable: true,
      isArchived: false,
    })),
  );
  console.log(`✨ ${createdServices.length} services créés`);

  // Compte admin
  const adminExists = await User.findOne({ email: 'admin@lunaria.bj' });
  if (!adminExists) {
    await User.create({
      firstName: 'Admin',
      lastName: 'LUNARIA',
      email: 'admin@lunaria.bj',
      phone: '+22900000000',
      password: await bcrypt.hash('Lunaria2025!', 10),
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
      favorites: [],
    });
    console.log('👤 Compte admin créé : admin@lunaria.bj / Lunaria2025!');
  }

  // Compte client test
  const clientExists = await User.findOne({ email: 'client@test.bj' });
  if (!clientExists) {
    await User.create({
      firstName: 'Aïssatou',
      lastName: 'Koné',
      email: 'client@test.bj',
      phone: '+22966123456',
      password: await bcrypt.hash('Test1234!', 10),
      role: 'CLIENT',
      isVerified: true,
      isActive: true,
      favorites: [],
    });
    console.log('👤 Compte client créé : client@test.bj / Test1234!');
  }

  // Codes promo
  await PromoCode.deleteMany({});
  const valentine = new Date();
  valentine.setMonth(1, 28);
  const meres = new Date();
  meres.setMonth(4, 31);
  await PromoCode.insertMany([
    {
      code: 'BIENVENUE10',
      description: 'Réduction première commande',
      type: 'POURCENTAGE',
      value: 10,
      minOrderAmount: 5000,
      usedCount: 0,
      isActive: true,
    },
    {
      code: 'SAINTVALENTIN25',
      description: 'Saint-Valentin 2025',
      type: 'POURCENTAGE',
      value: 25,
      minOrderAmount: 20000,
      usedCount: 0,
      validUntil: valentine,
      isActive: true,
    },
    {
      code: 'MAMAN5000',
      description: 'Fête des mères',
      type: 'MONTANT_FIXE',
      value: 5000,
      minOrderAmount: 30000,
      usedCount: 0,
      validUntil: meres,
      isActive: true,
    },
  ]);
  console.log(
    '🎟️  3 codes promo créés (BIENVENUE10, SAINTVALENTIN25, MAMAN5000)',
  );

  await mongoose.disconnect();
  console.log('\n🎉 Seed terminé avec succès !');
  console.log('─────────────────────────────');
  console.log('Admin : admin@lunaria.bj / Lunaria2025!');
  console.log('Client : client@test.bj / Test1234!');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
