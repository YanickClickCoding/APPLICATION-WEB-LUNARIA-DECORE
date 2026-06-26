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
// Catégories finales demandées par le client (familles).
// « Évènement » regroupe Mariage + Communion + Baptême ; Saint-Valentin et
// Fiançailles sont rattachés à Romantique.
const CATEGORIES_DATA = [
  { name: 'Anniversaire', slug: 'anniversaire', icon: '🎂', image: U('1516802273409-68526ee1bdd6'), order: 1, description: 'Fêtez chaque anniversaire avec éclat' },
  { name: 'Baby shower', slug: 'baby-shower', icon: '🍼', image: U('1522673607200-164d1b6ce486'), order: 2, description: 'Célébrez l’arrivée de bébé en douceur' },
  { name: 'Bridal Shower', slug: 'bridal-shower', icon: '👰', image: U('1519225421980-715cb0215aed'), order: 3, description: 'Une fête mémorable avant le grand jour' },
  { name: 'Romantique', slug: 'romantique', icon: '🌹', image: U('1582657233272-66b9c5fa14a6'), order: 4, description: 'Décoration romantique, Saint-Valentin et fiançailles' },
  { name: 'Noël', slug: 'noel', icon: '🎄', image: U('1543589077-47d81606c1bf'), order: 5, description: 'La magie de Noël dans votre intérieur' },
  { name: 'Déco chambre', slug: 'deco-chambre', icon: '🛏️', image: U('1540518614846-7eded433c457'), order: 6, description: 'Transformez votre chambre en cocon' },
  { name: 'Coffrets et surprises', slug: 'coffrets-et-surprises', icon: '🎁', image: U('1549465220-1a8b9238cd48'), order: 7, description: 'Des cadeaux qui font toujours plaisir' },
  { name: 'Gonflage à l’hélium et bouquets', slug: 'gonflage-helium-bouquets', icon: '🎈', image: U('1530103862676-de8c9debad1d'), order: 8, description: 'Ballons hélium et bouquets festifs' },
  { name: 'Party plates', slug: 'party-plates', icon: '🍽️', image: U('1530103862676-de8c9debad1d'), order: 9, description: 'Vaisselle et art de la table pour vos fêtes' },
  { name: 'Sac cadeaux', slug: 'sac-cadeaux', icon: '🛍️', image: U('1513885535751-8b9238bd345a'), order: 10, description: 'Sacs et emballages cadeaux soignés' },
  { name: 'Évènement', slug: 'evenement', icon: '💍', image: U('1518621736915-f3b1c41bfd00'), order: 11, description: 'Mariage, communion, baptême et autres cérémonies' },
  { name: 'Accessoires', slug: 'accessoires', icon: '✨', image: U('1535254973040-607b474cb50d'), order: 12, description: 'Tous les petits plus pour sublimer vos décors' },
  { name: 'Location', slug: 'location', icon: '📦', image: U('1464366400600-7168b8af9bc3'), order: 13, description: 'Matériel et décors en location' },
  { name: 'Fleurs synthétiques', slug: 'fleurs-synthetiques', icon: '🌸', image: U('1490750967868-88df5691cc3c'), order: 14, description: 'Compositions florales artificielles durables' },
  { name: 'Fête des mères', slug: 'fete-des-meres', icon: '🌷', image: U('1490750967868-88df5691cc3c'), order: 15, description: 'Honorez la femme de votre vie' },
  { name: 'Fête des pères', slug: 'fete-des-peres', icon: '👑', image: U('1485546246426-f4b8b59c3b3e'), order: 16, description: 'Surprenez le héros de la famille' },
];

// Thèmes de génération produits (variété du catalogue) → catégorie cible.
// Permet de garder ~10 produits variés par thème tout en les classant dans la
// bonne famille. Un produit dont le thème ≠ catégorie sera multi-catégorisé.
const THEME_TO_TARGET: Record<string, string> = {
  anniversaire: 'anniversaire',
  'baby-shower': 'baby-shower',
  'bridal-shower': 'bridal-shower',
  romantique: 'romantique',
  'saint-valentin': 'romantique',
  fiancailles: 'romantique',
  noel: 'noel',
  'deco-chambre': 'deco-chambre',
  'coffrets-et-surprises': 'coffrets-et-surprises',
  'gonflage-a-l-helium-et-bouquets': 'gonflage-helium-bouquets',
  'party-plates': 'party-plates',
  'sac-cadeaux': 'sac-cadeaux',
  mariage: 'evenement',
  communion: 'evenement',
  bapteme: 'evenement',
  accessoires: 'accessoires',
  location: 'location',
  'fleurs-synthetiques': 'fleurs-synthetiques',
  'fete-des-meres': 'fete-des-meres',
  'fete-des-peres': 'fete-des-peres',
};
const THEMES = Object.keys(THEME_TO_TARGET);

// Slug stable et lisible : nettoyage du nom + suffixe déterministe (index).
// Pas de timestamp → les URLs survivent aux re-seeds et restent partageables.
const slug = (name: string, suffix: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') +
  '-' +
  suffix;

// ─── Générateur de produits (10 par catégorie) ──────────────────────────
type CatMap = Record<string, mongoose.Types.ObjectId>;
interface ProductSeed {
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  categories: mongoose.Types.ObjectId[];
  tags: string[];
  stock: number;
  isFeatured: boolean;
  ratings: { average: number; count: number };
}

// Pool d'images vérifiées (HTTP 200) — voir frontend/src/utils/images.ts.
const IMG = {
  bougies: ['1602874801007-bd458bb1b8b6', '1602028915047-37269d1a73f7', '1543946207-39bd91e70ca7'],
  guirlandes: ['1482555670981-4de159d8553b', '1545127398-14699f92334b', '1508873699372-7aeab60b44ab', '1492684223066-81342ee5ff30'],
  roses: ['1462275646964-a0e3386b89fa', '1487070183336-b863922373d4', '1464349095431-e9a21285b5f3'],
  coeur: ['1513151233558-d860c5398176', '1530103862676-de8c9debad1d'],
  mariage: ['1518621736915-f3b1c41bfd00', '1523438885200-e635ba2c371e', '1464366400600-7168b8af9bc3', '1469504512102-900f29606341'],
  table: ['1464366400600-7168b8af9bc3', '1485955900006-10f4d324d411', '1540574163026-643ea20ade25'],
  fete: ['1516802273409-68526ee1bdd6', '1527529482837-4698179dc6ce', '1519741497674-611481863552'],
  pere: ['1569529465841-dfecdab7503b', '1511381939415-e44015466834', '1510812431401-41d2bd2722f3'],
  bapteme: ['1522673607200-164d1b6ce486', '1584100936595-c0654b55a2e2'],
  chambre: ['1540518614846-7eded433c457', '1631049307264-da0ec9d70304', '1540574163026-643ea20ade25'],
  divers: ['1618160702438-9b02ab6515c9', '1540574163026-643ea20ade25', '1535254973040-607b474cb50d'],
};
const img = (ids: string[], i: number) => U(ids[i % ids.length], 600, 600);
const img2 = (a: string[], b: string[], i: number) => [img(a, i), img(b, i + 1)];

// Modèle de catalogue : pour chaque catégorie, 10 produits.
// [nom, accroche, description, prix, comparePrice|0, [pool images], tags…]
type Row = [string, string, string, number, number, string[], string[]];

function rows(catSlug: string): Row[] {
  switch (catSlug) {
    case 'communion':
      return [
        ['Arche Blanche & Dorée Communion', 'Arche sobre pour la cérémonie de communion', "Arche décorée de fleurs blanches et de voilage doré, pour une communion élégante et lumineuse. Location à la journée, installation incluse.", 38000, 0, IMG.mariage, ['arche', 'communion', 'blanc']],
        ['Centre de Table Communion', 'Composition blanche et verdure pour les tables', "Centre de table sobre en fleurs blanches et eucalyptus, avec une touche dorée. Parfait pour les tables du repas de communion. Prix à la pièce.", 12000, 16000, IMG.table, ['centre de table', 'communion', 'blanc']],
        ['Bougie de Communion Personnalisée', 'Cierge décoré au prénom de l\'enfant', 'Cierge de communion décoré (croix, épis, ruban) personnalisé au prénom et à la date. Un souvenir précieux de ce grand jour.', 6500, 0, IMG.bougies, ['cierge', 'communion', 'personnalisé']],
        ['Chemin de Table Blanc & Or 5m', 'Voile satiné pour la table d\'honneur', 'Chemin de table en satin blanc nacré bordé d\'un liseré doré, 5 mètres. Habille élégamment la table d\'honneur ou le buffet.', 6500, 0, IMG.table, ['chemin de table', 'satin', 'communion']],
        ['Ballons de Communion (lot)', 'Ballons blancs et dorés assortis', 'Lot de ballons blancs, ivoire et dorés (latex et chiffres) pour décorer la salle de communion avec sobriété et éclat.', 7000, 9000, IMG.guirlandes, ['ballons', 'communion', 'doré']],
        ['Boîtes à Dragées (lot de 20)', 'Contenants à dragées pour les invités', 'Lot de 20 boîtes à dragées blanches au design croix/colombe, à garnir pour offrir aux invités en souvenir de la communion.', 9000, 12000, IMG.divers, ['dragées', 'communion', 'cadeau']],
        ['Panneau Bienvenue Communion', 'Pancarte calligraphiée au prénom de l\'enfant', 'Panneau de bienvenue en bois avec calligraphie personnalisée au prénom de l\'enfant et à la date. Sur chevalet doré. Livré en 72h.', 14000, 0, IMG.mariage, ['panneau', 'bienvenue', 'communion']],
        ['Guirlande Florale Blanche 3m', 'Cascade de fleurs artificielles blanches', 'Guirlande florale de 3 mètres en fleurs artificielles blanches premium (roses, eucalyptus). Idéale pour l\'arche, la table d\'honneur ou le coin photo.', 20000, 0, IMG.guirlandes, ['guirlande', 'florale', 'communion']],
        ['Photophores Blancs (lot de 6)', 'Porte-bougies pour une lumière douce', 'Lot de 6 photophores en verre dépoli blanc pour une lumière tamisée et délicate sur les tables de communion. Compatibles bougies LED.', 11000, 14000, IMG.bougies, ['photophore', 'verre', 'communion']],
        ['Marque-Places Communion (x20)', 'Étiquettes prénoms pour les invités', 'Lot de 20 marque-places personnalisés aux prénoms des invités, design blanc et doré assorti à la communion. Touche raffinée pour les tables.', 6000, 0, IMG.divers, ['marque-places', 'communion', 'invités']],
      ];
    case 'mariage':
      return [
        ['Arche Fleurie Blanche (location)', 'Arche décorée de fleurs fraîches pour cérémonie', "Magnifiez votre cérémonie avec cette arche entièrement décorée de fleurs blanches et de verdure. Location à la journée, installation et reprise incluses.", 45000, 0, IMG.mariage, ['arche', 'fleurs', 'cérémonie']],
        ['Centre de Table Floral Mariage', 'Composition florale pour table de réception', "Élégant centre de table avec roses blanches, eucalyptus et boutons d'or. Composition fraîche préparée le jour J. Prix à la pièce.", 15000, 20000, IMG.table, ['centre de table', 'floral', 'roses']],
        ['Photophore en Verre Doré (lot de 6)', 'Porte-bougies en verre soufflé, finition or', 'Ces 6 photophores en verre soufflé à finition dorée apportent une touche luxueuse à votre table de mariage. Compatibles bougies chauffe-plat et LED.', 12000, 16000, IMG.bougies, ['photophore', 'verre', 'doré']],
        ['Chemin de Table Satin Blanc 5m', 'Voile de satin pour sublimer la table d\'honneur', 'Chemin de table en satin blanc nacré de 5 mètres, finition surfilée. Drape élégamment la table des mariés ou le buffet.', 6500, 0, IMG.table, ['chemin de table', 'satin', 'blanc']],
        ['Coupe à Champagne Gravée (x2)', 'Coupes dorées avec gravure florale, pour les mariés', 'Paire de coupes à champagne en verre soufflé à finition dorée avec décoration florale gravée. Parfaites pour le toast des mariés.', 12000, 0, IMG.pere, ['coupe', 'champagne', 'dorée']],
        ['Housses de Chaise Lycra (lot de 10)', 'Housses extensibles blanches avec nœud satin', 'Lot de 10 housses de chaise en lycra blanc avec nœuds en satin. Transforment instantanément une salle de réception. Lavables et réutilisables.', 18000, 24000, IMG.mariage, ['housse', 'chaise', 'réception']],
        ['Panneau Bienvenue Personnalisé', 'Pancarte calligraphiée au nom des mariés', 'Panneau de bienvenue en bois avec calligraphie personnalisée aux prénoms des mariés et date. Sur chevalet doré. Livré en 72h.', 14000, 0, IMG.mariage, ['panneau', 'bienvenue', 'personnalisé']],
        ['Guirlande Florale Suspendue 3m', 'Cascade de fleurs artificielles haut de gamme', 'Guirlande florale suspendue de 3 mètres en fleurs artificielles premium (roses, pivoines, eucalyptus). Idéale pour arche, plafond ou table d\'honneur.', 22000, 0, IMG.guirlandes, ['guirlande', 'florale', 'suspendue']],
        ['Tapis de Cérémonie Blanc 10m', 'Allée nuptiale en moquette événementielle', 'Tapis d\'allée blanc de 10 mètres pour l\'entrée de la mariée. Moquette événementielle antidérapante, pose incluse en zone Cotonou.', 28000, 35000, IMG.mariage, ['tapis', 'allée', 'cérémonie']],
        ['Lanternes Décoratives Dorées (lot de 4)', 'Lanternes métal et verre pour allée ou tables', 'Lot de 4 lanternes en métal doré et verre, hauteurs assorties. Accueillent une bougie LED pour baliser l\'allée ou décorer les tables.', 16000, 0, IMG.guirlandes, ['lanterne', 'dorée', 'allée']],
      ];
    case 'saint-valentin':
      return [
        ['Pétales de Roses Rouges (500g)', 'Vraies pétales de roses séchées, rouge intense', 'Créez un chemin de roses ou décorez votre lit avec ces véritables pétales de roses rouges. 500g de pétales séchés premium pour une décoration inoubliable.', 4000, 5500, IMG.roses, ['roses', 'pétales', 'romantique']],
        ['Ballon Cœur Géant Rouge 90cm', 'Ballon en forme de cœur XXL, qualité premium', "Un cœur géant pour une déclaration d'amour spectaculaire ! Ballon en latex de 90cm, parfait pour la Saint-Valentin et les demandes en mariage.", 3000, 0, IMG.coeur, ['ballon', 'coeur', 'déclaration']],
        ['Cœur Lumineux LED 40cm', 'Décoration murale cœur en néon LED, câble USB', 'Un cœur lumineux LED de 40cm pour sublimer votre chambre ou table de cérémonie. Lumière chaude, alimentation USB, parfait pour les photos.', 8500, 0, IMG.coeur, ['coeur', 'led', 'neon']],
        ['Kit Bougies LED Rouges (10 pièces)', 'Bougies à flamme vacillante, sans danger', 'Kit de 10 bougies LED à flamme vacillante ultra-réaliste, alimentation par piles. Créez une atmosphère romantique sans risque d\'incendie.', 3500, 5000, IMG.bougies, ['bougies', 'led', 'rouge']],
        ['Lettres Lumineuses "LOVE"', 'Mot LOVE en lettres LED pour fond photo', 'Lettres lumineuses "LOVE" de 20cm en LED blanc chaud. Parfaites en fond de table ou pour vos photos de Saint-Valentin. Piles incluses.', 11000, 0, IMG.guirlandes, ['love', 'led', 'lettres']],
        ['Bouquet Éternel Roses Rouges', 'Roses stabilisées sous cloche en verre', 'Roses rouges stabilisées (vraies fleurs durables 2-3 ans) sous cloche de verre. Le cadeau romantique qui ne fane jamais.', 16000, 21000, IMG.roses, ['roses', 'éternelles', 'cloche']],
        ['Guirlande Cœurs Lumineuse 3m', 'Guirlande LED à mini-cœurs roses', 'Guirlande de 3 mètres à 30 mini-cœurs lumineux roses. Lumière douce, à piles. Idéale pour encadrer un lit ou une fenêtre.', 4500, 0, IMG.guirlandes, ['guirlande', 'coeurs', 'led']],
        ['Boîte Surprise "Je t\'aime"', 'Coffret cadeau avec pétales et message', 'Coffret cadeau garni de pétales de roses, d\'une carte message et d\'un emplacement pour bijou ou chocolats. Effet waouh garanti à l\'ouverture.', 7500, 9500, IMG.divers, ['coffret', 'surprise', 'cadeau']],
        ['Set Photo "Saint-Valentin"', 'Accessoires photobooth thème amour', 'Set de 12 accessoires photobooth sur le thème de l\'amour : cœurs, moustaches, pancartes "I love you". Pour des photos drôles et tendres.', 5000, 0, IMG.fete, ['photobooth', 'accessoires', 'amour']],
        ['Chemin de Bougies (set de 20)', 'Bougies LED dorées pour tracer un chemin', 'Set de 20 bougies LED dorées pour créer un chemin lumineux romantique jusqu\'à votre surprise. Effet cinéma garanti.', 9000, 12000, IMG.bougies, ['bougies', 'chemin', 'romantique']],
      ];
    case 'anniversaire':
      return [
        ['Kit Décoration Anniversaire Doré', 'Ballons, banderole, confettis — tout pour la fête', 'Kit complet : 20 ballons dorés et noirs, banderole "Joyeux Anniversaire", confettis étoiles et 2 ballons chiffres. Tout pour une fête mémorable.', 9500, 13000, IMG.fete, ['anniversaire', 'ballons', 'kit']],
        ['Arche de Ballons Organique', 'Guirlande de ballons aux couleurs au choix', 'Arche de ballons façon "organique" de 2m, dégradé de couleurs au choix. Montage sur structure, prête à poser à l\'entrée ou en fond de table.', 17000, 0, IMG.fete, ['arche', 'ballons', 'organique']],
        ['Bannière "Happy Birthday" Personnalisée', 'Bannière tissu avec prénom du fêté', 'Bannière en tissu de haute qualité, personnalisable avec le prénom. Dimensions 2m × 30cm, réutilisable, livrée en 48h.', 7000, 0, IMG.fete, ['bannière', 'personnalisé']],
        ['Ballons Chiffres Lumineux LED', 'Chiffres géants 80cm avec LED intégrées', 'Paire de ballons chiffres géants de 80cm avec LED intégrées. Composez n\'importe quel âge. Gonflage à l\'hélium possible en boutique.', 8000, 0, IMG.guirlandes, ['chiffres', 'led', 'géant']],
        ['Backdrop Photo à Sequins', 'Rideau pailleté pour fond de photos', 'Rideau de fond pailleté (sequins) de 2m × 1m, or ou rose. Crée un fond photo scintillant pour immortaliser la fête.', 13000, 16000, IMG.guirlandes, ['backdrop', 'sequins', 'photo']],
        ['Confettis & Canons à Paillettes (x6)', 'Canons à confettis pour le moment clé', 'Lot de 6 canons à confettis et paillettes biodégradables. Pour un final spectaculaire au moment du gâteau ou des 12 coups de minuit.', 4500, 0, IMG.fete, ['confettis', 'canons', 'paillettes']],
        ['Centre de Table Festif (x5)', 'Compositions ballons et fleurs pour tables', 'Lot de 5 centres de table festifs combinant mini-ballons, fleurs et bougie LED. Habillent élégamment les tables des invités.', 14000, 18000, IMG.table, ['centre de table', 'festif']],
        ['Guirlande Fanions Multicolore 10m', 'Guirlande tissu réutilisable pour salle', 'Guirlande de fanions en tissu de 10 mètres, multicolore. Réutilisable, habille les murs et plafonds en un clin d\'œil.', 5500, 0, IMG.guirlandes, ['fanions', 'guirlande', 'salle']],
        ['Set Vaisselle Jetable Premium', 'Assiettes, gobelets, serviettes assortis (x24)', 'Set complet pour 24 personnes : assiettes, gobelets et serviettes assortis aux couleurs de la fête. Carton épais qualité premium.', 9000, 11000, IMG.table, ['vaisselle', 'jetable', 'premium']],
        ['Photobooth Complet à Cadre', 'Cadre géant + accessoires pour photos', 'Cadre photobooth géant doré + 15 accessoires rigolos. Animez la fête et repartez avec des souvenirs photo inoubliables.', 12000, 0, IMG.fete, ['photobooth', 'cadre', 'animation']],
      ];
    case 'fete-des-meres':
      return [
        ['Bouquet de 30 Roses Roses', 'Roses fraîches premium, emballage élégant', 'Magnifique bouquet de 30 roses fraîches rose tendre. Emballage cadeau avec ruban satin et carte message personnalisée. Disponible le jour J.', 18000, 22000, IMG.roses, ['roses', 'bouquet', 'fleurs']],
        ['Coffret "Merci Maman"', 'Bougie, fleurs séchées et carte douceur', 'Coffret cadeau garni d\'une bougie parfumée, d\'un bouquet de fleurs séchées et d\'une carte personnalisée. Une attention pleine de tendresse.', 14000, 17000, IMG.divers, ['coffret', 'maman', 'cadeau']],
        ['Bougie Parfumée Rose & Pivoine', 'Cire végétale, fragrance florale délicate', 'Bougie artisanale en cire de soja naturelle, parfum rose et pivoine. 45h de combustion, pot en verre réutilisable. Le cadeau cocooning idéal.', 6500, 8000, IMG.bougies, ['bougie', 'parfumée', 'rose']],
        ['Composition Florale en Boîte', 'Roses fraîches arrangées en flowerbox', 'Roses fraîches arrangées dans une élégante boîte ronde (flowerbox). Tient sans entretien plusieurs jours. Couleur au choix.', 20000, 0, IMG.roses, ['flowerbox', 'roses', 'composition']],
        ['Bouquet de Fleurs Séchées', 'Composition durable tons pastel', 'Bouquet de fleurs séchées aux tons pastel (lagurus, eucalyptus, statice). Décoratif et durable, ne fane pas. Emballage kraft soigné.', 12000, 15000, IMG.roses, ['fleurs séchées', 'durable', 'pastel']],
        ['Vase Décoratif en Céramique', 'Vase artisanal pour sublimer un bouquet', 'Vase en céramique artisanale, finition mate, pour mettre en valeur un bouquet. Pièce décorative qui se garde bien après la fête.', 9500, 0, IMG.divers, ['vase', 'céramique', 'déco']],
        ['Carte Géante Personnalisée', 'Grande carte à message avec photos', 'Carte géante (A3) personnalisable avec photos et message pour maman. Imprimée sur papier épais, livrée avec enveloppe assortie.', 4500, 0, IMG.fete, ['carte', 'personnalisé', 'message']],
        ['Couronne de Fleurs Murale', 'Couronne florale à suspendre', 'Couronne de fleurs artificielles premium à suspendre. Décoration murale élégante et durable pour la chambre ou le salon de maman.', 13000, 16000, IMG.roses, ['couronne', 'florale', 'murale']],
        ['Set Spa "Détente Maman"', 'Bougie, sels et accessoires bien-être', 'Set bien-être : bougie parfumée, sels de bain, et accessoires détente présentés dans un panier garni. Offrez un moment de pure détente.', 17000, 21000, IMG.divers, ['spa', 'détente', 'bien-être']],
        ['Guirlande Photos Lumineuse', 'Guirlande LED avec pinces à photos', 'Guirlande LED de 3m avec 20 mini-pinces pour accrocher vos plus belles photos de famille. Un cadeau souvenir lumineux et émouvant.', 5500, 0, IMG.guirlandes, ['guirlande', 'photos', 'led']],
      ];
    case 'fete-des-peres':
      return [
        ['Coffret Whisky & Verres', 'Set de 2 verres à whisky avec pierres', 'Coffret cadeau avec 2 verres à whisky en cristal et pierres à whisky réutilisables. Présenté dans une boîte bois élégante.', 19000, 24000, IMG.pere, ['whisky', 'verres', 'coffret']],
        ['Box "Super Papa" Personnalisée', 'Coffret garni personnalisable', 'Coffret cadeau personnalisable "Super Papa" : mug, carte, et emplacements pour vos petites attentions. Le cadeau qui touche en plein cœur.', 13000, 16000, IMG.pere, ['papa', 'coffret', 'personnalisé']],
        ['Mug Personnalisé Photo', 'Tasse céramique avec photo et message', 'Mug en céramique personnalisé avec votre photo et un message. Passe au lave-vaisselle. Un cadeau du quotidien plein de sens.', 5000, 0, IMG.divers, ['mug', 'photo', 'personnalisé']],
        ['Cadre Photo Décoratif', 'Cadre élégant pour souvenir de famille', 'Cadre photo en bois et verre, finition soignée, pour immortaliser un souvenir de famille. Plusieurs formats disponibles.', 7500, 0, IMG.divers, ['cadre', 'photo', 'déco']],
        ['Bannière "Joyeuse Fête Papa"', 'Bannière tissu réutilisable', 'Bannière en tissu "Joyeuse Fête Papa" de 2m, réutilisable. Décorez la maison pour surprendre papa dès le réveil.', 6000, 0, IMG.fete, ['bannière', 'papa', 'fête']],
        ['Set Apéro Détente', 'Plateau, verres et accessoires apéritif', 'Set apéro complet : plateau en bois, 4 verres et accessoires. Pour partager un moment convivial avec papa. Présenté en panier garni.', 16000, 20000, IMG.pere, ['apéro', 'détente', 'set']],
        ['Bougie Parfumée Bois & Cuir', 'Fragrance masculine, cire naturelle', 'Bougie artisanale en cire de soja, fragrance bois de santal et cuir. Une senteur masculine élégante. 45h de combustion.', 6500, 8000, IMG.bougies, ['bougie', 'bois', 'cuir']],
        ['Coffret Soin Barbe', 'Huile, baume et peigne en bois', 'Coffret de soin pour la barbe : huile nourrissante, baume coiffant et peigne en bois. Pour un papa toujours tiré à quatre épingles.', 14000, 17000, IMG.divers, ['barbe', 'soin', 'coffret']],
        ['Décoration de Table "Papa"', 'Set complet pour un repas en son honneur', 'Set de décoration de table pour un repas en l\'honneur de papa : chemin de table, marque-places, centre de table et bougies.', 11000, 0, IMG.table, ['table', 'décoration', 'repas']],
        ['Guirlande Photos Souvenirs', 'Guirlande LED avec pinces photos', 'Guirlande LED de 3m avec pinces pour accrocher vos souvenirs père-enfant. Un cadeau lumineux qui raconte votre histoire.', 5500, 0, IMG.guirlandes, ['guirlande', 'photos', 'souvenirs']],
      ];
    case 'bapteme':
      return [
        ['Kit Décoration Baptême Pastel', 'Ballons, organza et guirlandes pastel', "Kit complet pour un baptême, en bleu (garçon) ou rose (fille) : ballons, guirlandes, organza, chemin de table et porte-bougies.", 15000, 0, IMG.bapteme, ['baptême', 'kit', 'pastel']],
        ['Arche de Ballons Bébé', 'Arche pastel pour l\'entrée ou le buffet', 'Arche de ballons de 2m en dégradé pastel, façon nuage. Accueille les invités ou habille la table du buffet. Montage inclus.', 16000, 20000, IMG.bapteme, ['arche', 'ballons', 'bébé']],
        ['Bannière "Bienvenue Bébé"', 'Bannière tissu personnalisable au prénom', 'Bannière en tissu "Bienvenue" personnalisable au prénom de bébé. Tons doux, réutilisable, livrée en 72h.', 7000, 0, IMG.bapteme, ['bannière', 'bébé', 'personnalisé']],
        ['Centre de Table Nuage (x4)', 'Compositions douces ballons et fleurs', 'Lot de 4 centres de table sur le thème du nuage : mini-ballons, fleurs pastel et bougie LED. Habillent délicatement les tables.', 13000, 16000, IMG.table, ['centre de table', 'nuage', 'pastel']],
        ['Guirlande Étoiles Lumineuse', 'Guirlande LED en forme d\'étoiles', 'Guirlande de 3m à 20 étoiles lumineuses LED, lumière douce. Crée une ambiance féerique au-dessus du berceau décoratif ou de la table.', 5500, 0, IMG.guirlandes, ['guirlande', 'étoiles', 'led']],
        ['Ballons Hélium Chiffre "1"', 'Ballon géant pour le premier anniversaire', 'Ballon chiffre géant de 80cm pour célébrer le premier anniversaire ou le baptême. Gonflage hélium possible en boutique.', 6000, 0, IMG.guirlandes, ['ballon', 'chiffre', 'hélium']],
        ['Photobooth "Baby Shower"', 'Cadre et accessoires sur le thème bébé', 'Cadre photobooth + 12 accessoires sur le thème bébé. Pour des photos attendrissantes avec les invités du baptême.', 11000, 14000, IMG.fete, ['photobooth', 'baby shower', 'bébé']],
        ['Drapé Organza & Tulle', 'Voilage pastel pour habiller mur ou table', 'Drapé en organza et tulle pastel de 5m pour habiller un mur, une table d\'honneur ou un coin photo. Effet doux et aérien.', 8500, 0, IMG.bapteme, ['organza', 'tulle', 'drapé']],
        ['Bougies LED Pastel (x10)', 'Bougies douces sans danger pour bébé', 'Lot de 10 bougies LED aux teintes pastel, à flamme vacillante et sans danger. Parfaites autour des plus petits.', 4000, 5000, IMG.bougies, ['bougies', 'led', 'pastel']],
        ['Marque-Places Personnalisés (x20)', 'Étiquettes prénoms pour les invités', 'Lot de 20 marque-places personnalisés aux prénoms des invités, design pastel assorti au baptême. Touche raffinée pour les tables.', 6000, 0, IMG.bapteme, ['marque-places', 'personnalisé', 'invités']],
      ];
    case 'fiancailles':
      return [
        ['Coffret "Oui Je le veux"', 'Bougies, pétales et photophores réunis', 'Coffret pour la demande parfaite : 6 bougies parfumées, 200g de pétales rouges, 4 photophores dorés, guirlande 3m et tapis moelleux.', 35000, 42000, IMG.roses, ['demande', 'romantique', 'coffret']],
        ['Lettres Lumineuses "MARRY ME"', 'Mot lumineux pour la grande question', 'Lettres lumineuses "MARRY ME" en LED blanc chaud. Le décor incontournable pour poser LA question de façon spectaculaire.', 18000, 0, IMG.guirlandes, ['marry me', 'led', 'demande']],
        ['Chemin de Bougies & Pétales', 'Set pour tracer un chemin romantique', 'Set complet pour tracer un chemin romantique : 30 bougies LED et 300g de pétales de roses rouges. Effet cinéma garanti.', 14000, 18000, IMG.bougies, ['chemin', 'bougies', 'pétales']],
        ['Cœur Géant de Ballons', 'Structure cœur en ballons rouges et roses', 'Structure en forme de cœur (1,5m) garnie de ballons rouges et roses. Fond romantique idéal pour la demande et les photos.', 16000, 0, IMG.coeur, ['coeur', 'ballons', 'structure']],
        ['Bouquet de Roses Rouges (50)', 'Imposant bouquet pour une grande demande', 'Imposant bouquet de 50 roses rouges fraîches, emballage luxe avec ruban satin. Pour une demande qui marque les esprits.', 32000, 38000, IMG.roses, ['roses', 'bouquet', 'luxe']],
        ['Bague Décorative Géante LED', 'Bague lumineuse pour la mise en scène', 'Bague décorative géante lumineuse (40cm) en LED. Élément de décor original pour symboliser votre engagement sur les photos.', 12000, 0, IMG.guirlandes, ['bague', 'led', 'décor']],
        ['Champagne & Coupes Gravées', 'Set de 2 coupes dorées pour trinquer', 'Set de 2 coupes à champagne dorées et gravées pour célébrer le "oui". Présentées dans un écrin. Champagne non inclus.', 13000, 16000, IMG.pere, ['champagne', 'coupes', 'trinquer']],
        ['Rideau Lumineux Étoilé 3m', 'Rideau de LED pour un fond féerique', 'Rideau lumineux de 3m × 2m à 300 LED, façon ciel étoilé. Crée un fond magique pour la demande et les photos souvenirs.', 11000, 0, IMG.guirlandes, ['rideau', 'led', 'étoilé']],
        ['Coffret Roses Éternelles', 'Roses stabilisées en écrin de luxe', 'Roses rouges stabilisées (durables 2-3 ans) présentées dans un écrin de luxe en forme de cœur. Le symbole d\'un amour qui dure.', 24000, 29000, IMG.roses, ['roses', 'éternelles', 'écrin']],
        ['Mise en Scène Photo Souvenir', 'Décor complet + accessoires photos', 'Décor de mise en scène complet pour vos photos de fiançailles : panneau personnalisé, guirlandes et accessoires assortis.', 20000, 0, IMG.fete, ['photo', 'mise en scène', 'souvenir']],
      ];
    case 'romantique':
    default:
      return [
        ['Kit Bougies LED Romantiques (10)', 'Bougies à flamme vacillante, sans danger', 'Kit de 10 bougies LED à flamme vacillante ultra-réaliste, à piles. Créez une atmosphère envoûtante sans risque d\'incendie.', 3500, 5000, IMG.bougies, ['bougies', 'led', 'romantique']],
        ['Guirlande Lumineuse Dorée 10m', 'Fil de cuivre, 100 micro-ampoules chaudes', "Guirlande de 10m en fil de cuivre, 100 micro-ampoules à lumière chaude. Ambiance féerique pour chambre, fenêtre ou tête de lit.", 5500, 0, IMG.guirlandes, ['guirlande', 'led', 'dorée']],
        ['Bougie Parfumée Rose & Oud (250g)', 'Cire végétale, fragrance rose et bois de oud', 'Bougie artisanale en cire de soja, parfum rose et bois de oud. 45h de combustion, mèche coton, pot en verre réutilisable.', 6500, 8000, IMG.bougies, ['bougie', 'parfumée', 'oud']],
        ['Rideau de Guirlandes LED 3m', 'Rideau lumineux pour tête de lit ou mur', 'Rideau de guirlandes LED de 3m × 2m, 300 ampoules à lumière chaude. Transforme une tête de lit ou un mur en ciel étoilé.', 9000, 12000, IMG.guirlandes, ['rideau', 'guirlandes', 'led']],
        ['Pétales de Roses (mix rouge & rose)', 'Pétales séchés pour lit et chemin romantique', 'Sachet de pétales de roses séchées (mix rouge et rose). Pour décorer un lit, tracer un chemin ou parsemer une table romantique.', 4000, 0, IMG.roses, ['pétales', 'roses', 'romantique']],
        ['Coussins Velours Cœur (x2)', 'Paire de coussins doux pour la chambre', 'Paire de coussins en velours, doux au toucher, pour habiller le lit ou le canapé d\'une touche cosy et romantique.', 11000, 14000, IMG.divers, ['coussin', 'velours', 'cosy']],
        ['Diffuseur de Parfum d\'Ambiance', 'Senteur florale apaisante pour la chambre', 'Diffuseur à bâtonnets, senteur florale apaisante. Parfume durablement la chambre pour une ambiance enveloppante et romantique.', 7000, 0, IMG.divers, ['diffuseur', 'parfum', 'ambiance']],
        ['Plaid Cocooning Doux', 'Couverture moelleuse pour soirées câlines', 'Plaid moelleux ultra-doux, idéal pour des soirées câlines. Habille joliment le lit ou le canapé. Lavable en machine.', 12000, 15000, IMG.divers, ['plaid', 'cocooning', 'doux']],
        ['Photophores en Verre (lot de 4)', 'Porte-bougies pour une lumière tamisée', 'Lot de 4 photophores en verre pour une lumière tamisée et romantique. Compatibles bougies chauffe-plat et LED.', 8000, 10000, IMG.bougies, ['photophore', 'verre', 'tamisé']],
        ['Set "Soirée Romantique"', 'Bougies, pétales et guirlande réunis', 'Set tout-en-un pour une soirée à deux : bougies LED, pétales de roses et guirlande lumineuse. Tout pour une ambiance romantique réussie.', 13000, 17000, IMG.chambre, ['set', 'soirée', 'romantique']],
      ];
  }
}

const FEATURED_PER_CAT = 3; // les 3 premiers de chaque catégorie sont "vedette"

function buildProducts(catMap: CatMap): ProductSeed[] {
  const all: ProductSeed[] = [];
  // On génère par THÈME (variété du catalogue) mais on classe dans la CATÉGORIE cible.
  for (const theme of THEMES) {
    const targetSlug = THEME_TO_TARGET[theme];
    const targetId = catMap[targetSlug];
    if (!targetId) continue;
    rows(theme).forEach(([name, short, desc, price, cmp, pool, tags], i) => {
      all.push({
        name,
        shortDescription: short,
        description: desc,
        price,
        comparePrice: cmp || undefined,
        images: img2(pool, pool, i),
        category: targetId,
        categories: [targetId],
        // on conserve le thème d'origine en tag (utile pour recherche / reclassement)
        tags: [...tags, theme],
        stock: 8 + ((i * 7) % 45),
        isFeatured: i < FEATURED_PER_CAT,
        ratings: {
          average: Math.round((4.5 + ((i * 3) % 5) / 10) * 10) / 10,
          count: 6 + ((i * 11) % 40),
        },
      });
    });
  }
  return all;
}

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

  // Produits — 10 par catégorie, générés depuis un catalogue thématique.
  const products = buildProducts(catMap);

  const createdProducts = await Product.insertMany(
    products.map((p, i) => ({
      ...p,
      slug: slug(p.name, String(i + 1)),
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
      category: catMap['evenement'],
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
      category: catMap['romantique'],
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
      category: catMap['evenement'],
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
      category: catMap['romantique'],
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
      slug: slug(s.name, 's' + String(i + 1)),
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
