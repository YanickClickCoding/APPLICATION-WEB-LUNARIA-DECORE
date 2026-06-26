/**
 * Seed des catégories LUNARIA.
 * Usage : node scripts/seed-categories.js
 * Idempotent : n'insère pas une catégorie dont le slug existe déjà.
 */
const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lunaria';

const NAMES = [
  'Anniversaire',
  'Baby shower',
  'Bridal Shower',
  'Romantic',
  'Noël',
  'Déco chambre',
  'Coffrets et surprises',
  'Gonflage à l’hélium et bouquets',
  'Party plates',
  'Sac cadeaux',
  'Mariage',
  'Communion',
  'Baptême',
  'Saint-Valentin',
  'Fête des mères',
  'Fête des pères',
  'Fiançailles',
  'Romantique',
  'Accessoires',
  'Location',
  'Fleurs synthétiques',
];

function toSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const categorySchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    description: String,
    image: String,
    icon: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

async function main() {
  await mongoose.connect(URI);
  const Category = mongoose.model('Category', categorySchema);

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < NAMES.length; i++) {
    const name = NAMES[i];
    const slug = toSlug(name);
    const exists = await Category.findOne({ slug });
    if (exists) {
      skipped++;
      console.log(`= déjà présent : ${name} (${slug})`);
      continue;
    }
    await Category.create({ name, slug, order: i, isActive: true });
    created++;
    console.log(`+ créée : ${name} (${slug})`);
  }

  console.log(`\nTerminé. ${created} créée(s), ${skipped} déjà existante(s).`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('Erreur seed :', e.message);
  process.exit(1);
});
