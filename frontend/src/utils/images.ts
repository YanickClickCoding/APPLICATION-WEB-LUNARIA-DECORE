// Images Unsplash gratuites, soigneusement sélectionnées pour LUNARIA Décoration
// Format : https://images.unsplash.com/photo-{id}?w={width}&q=80&fit=crop
// NOTE: chaque ID a été vérifié (HTTP 200) le 12/06/2026 — si une image casse,
// tester l'URL avec curl avant de remplacer l'ID.

const U = (id: string, w = 800, h?: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fit=crop${h ? `&h=${h}` : ''}`

// ─── Hero & backgrounds ──────────────────────────────────────────────────
export const HERO = {
  main:       U('1519741497674-611481863552', 1920, 1080), // bougies rouges romantiques
  dark:       U('1518621736915-f3b1c41bfd00', 1920, 1080), // salle décorée mariage
  sparkle:    U('1492684223066-81342ee5ff30', 1920, 1080), // lumières dorées festives (bokeh)
  valentine:  U('1547592180-85f173990554', 1920, 1080),    // pétales roses rouges bougies
  wedding:    U('1464349095431-e9a21285b5f3', 1920, 1080), // roses et bougies
}

// ─── Catégories ──────────────────────────────────────────────────────────
export const CATEGORIES = {
  mariage:       U('1519741497674-611481863552', 600, 400),
  anniversaire:  U('1516802273409-68526ee1bdd6', 600, 400), // gâteau bougies
  valentine:     U('1513151233558-d860c5398176', 600, 400), // coeur lumineux étincelles
  meres:         U('1487070183336-b863922373d4', 600, 400), // bouquet roses roses
  peres:         U('1569529465841-dfecdab7503b', 600, 400), // verre de whisky
  bapteme:       U('1522673607200-164d1b6ce486', 600, 400), // déco blanche douce
  ceremonie:     U('1523438885200-e635ba2c371e', 600, 400), // fleurs blanches mariage
  romantique:    U('1540518614846-7eded433c457', 600, 400), // chambre élégante tamisée
}

// ─── Produits individuels ────────────────────────────────────────────────
export const PRODUCTS = {
  bougieLed:      U('1602874801007-bd458bb1b8b6', 500),     // bougie chaleureuse
  guirlande:      U('1482555670981-4de159d8553b', 500),     // guirlande lumineuse
  petalesRoses:   U('1462275646964-a0e3386b89fa', 500),     // roses rouges
  ballon:         U('1530103862676-de8c9debad1d', 500),     // ballons rouge coeur
  vase:           U('1485955900006-10f4d324d411', 500),     // vase fleurs blanches
  bouquet:        U('1487070183336-b863922373d4', 500),     // bouquet roses roses
  coussin:        U('1584100936595-c0654b55a2e2', 500),     // coussins moelleux
  nappe:          U('1464366400600-7168b8af9bc3', 500),     // table dressée bougies
  photophore:     U('1543946207-39bd91e70ca7', 500),        // photophores bougies
  rideau:         U('1545127398-14699f92334b', 500),        // rideau lumière dorée
  coeurLed:       U('1513151233558-d860c5398176', 500),     // coeur lumineux étincelles
  tapis:          U('1540574163026-643ea20ade25', 500),     // salon cosy textile
  miroir:         U('1618160702438-9b02ab6515c9', 500),     // miroir décoratif
  boiteChoco:     U('1511381939415-e44015466834', 500),     // boîte chocolats
  lanternes:      U('1508873699372-7aeab60b44ab', 500),     // lanternes lumineuses
  ours:           U('1535254973040-607b474cb50d', 500),     // nounours romantique
  coupe:          U('1510812431401-41d2bd2722f3', 500),     // coupe champagne
  confettis:      U('1527529482837-4698179dc6ce', 500),     // confettis colorés
  couronne:       U('1469504512102-900f29606341', 500),     // couronne florale mariée
  bougiesAromes:  U('1602028915047-37269d1a73f7', 500),     // bougies parfumées
}

// ─── Services / Décorations complètes ───────────────────────────────────
export const SERVICES = {
  chambreRomantique: U('1540518614846-7eded433c457', 800, 600),  // chambre élégante tamisée
  chambrePrestige:   U('1631049307264-da0ec9d70304', 800, 600),  // suite luxe bougies
  mariage:           U('1518621736915-f3b1c41bfd00', 800, 600),  // salle mariage blanche
  mariageJardin:     U('1523438885200-e635ba2c371e', 800, 600),  // cérémonie extérieure
  anniversaire:      U('1516802273409-68526ee1bdd6', 800, 600),  // table anniversaire
  valentine:         U('1547592180-85f173990554', 800, 600),     // décor saint-valentin
  bapteme:           U('1522673607200-164d1b6ce486', 800, 600),  // décor baptême doux
  fieteMeres:        U('1487070183336-b863922373d4', 800, 600),  // bouquets fête des mères
  soinsTables:       U('1464366400600-7168b8af9bc3', 800, 600),  // table fleurie bougies
  salleFete:         U('1519741497674-611481863552', 800, 600),   // grande salle décorée
}

// ─── Galerie réalisations ────────────────────────────────────────────────
export const GALLERY = [
  { src: U('1540518614846-7eded433c457', 800, 600), cat: 'Chambre romantique',   occasion: 'Saint-Valentin' },
  { src: U('1518621736915-f3b1c41bfd00', 800, 600), cat: 'Salle de mariage',     occasion: 'Mariage' },
  { src: U('1547592180-85f173990554', 800, 600),    cat: 'Décoration bougies',    occasion: 'Anniversaire' },
  { src: U('1519741497674-611481863552', 800, 600), cat: 'Table romantique',      occasion: 'Saint-Valentin' },
  { src: U('1487070183336-b863922373d4', 800, 600), cat: 'Bouquet floral',        occasion: 'Fête des mères' },
  { src: U('1516802273409-68526ee1bdd6', 800, 600), cat: 'Gâteau et bougies',     occasion: 'Anniversaire' },
  { src: U('1523438885200-e635ba2c371e', 800, 600), cat: 'Cérémonie extérieure', occasion: 'Mariage' },
  { src: U('1631049307264-da0ec9d70304', 800, 600), cat: 'Suite de luxe',         occasion: 'Lune de miel' },
  { src: U('1464349095431-e9a21285b5f3', 800, 600), cat: 'Roses et bougies',     occasion: 'Saint-Valentin' },
  { src: U('1482555670981-4de159d8553b', 800, 600), cat: 'Guirlandes lumineuses', occasion: 'Baptême' },
  { src: U('1464366400600-7168b8af9bc3', 800, 600), cat: 'Table de cérémonie',   occasion: 'Mariage' },
  { src: U('1522673607200-164d1b6ce486', 800, 600), cat: 'Décoration baptême',   occasion: 'Baptême' },
]

// ─── Témoignages ─────────────────────────────────────────────────────────
export const AVATARS = [
  U('1438761681033-6461ffad8d80', 100, 100), // femme souriante
  U('1507003211169-0a1dd7228f2d', 100, 100), // homme souri
  U('1494790108377-be9c29b29330', 100, 100), // femme portrait
  U('1500648767791-00dcc994a43e', 100, 100), // homme décontracté
  U('1544005313-94ddf0286df2', 100, 100),    // femme africaine
]
