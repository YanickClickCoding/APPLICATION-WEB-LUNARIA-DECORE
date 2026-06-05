// Images Unsplash gratuites, soigneusement sélectionnées pour LUNARIA Décoration
// Format : https://images.unsplash.com/photo-{id}?w={width}&q=80&fit=crop

const U = (id: string, w = 800, h?: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fit=crop${h ? `&h=${h}` : ''}`

// ─── Hero & backgrounds ──────────────────────────────────────────────────
export const HERO = {
  main:       U('1519741497674-611481863552', 1920, 1080), // bougies rouges romantiques
  dark:       U('1518621736915-f3b1c41bfd00', 1920, 1080), // salle décorée mariage
  // NOTE: certaines images Unsplash peuvent être bloquées/indisponibles selon CSP/adblock.
  // On utilise donc un fallback plus robuste pour que les “bougies” s’affichent.
  sparkle:    U('1607346704353-a82cec7b6fce', 1920, 1080), // lumières dorées chambre

  valentine:  U('1547592180-85f173990554', 1920, 1080),    // pétales roses rouges bougies
  wedding:    U('1464349095431-e9a21285b5f3', 1920, 1080), // roses et bougies
}

// ─── Catégories ──────────────────────────────────────────────────────────
export const CATEGORIES = {
  mariage:       U('1519741497674-611481863552', 600, 400),
  anniversaire:  U('1516802273409-68526ee1bdd6', 600, 400), // gâteau bougies
  valentine:     U('1455264745730-cb3b76250ec8', 600, 400), // bougies coeur
  // NOTE: fallback éventuel (si la source bloque/casse, l’UI doit quand même afficher quelque chose)
  meres:         U('1490750967868-88df5691cc3c', 600, 400), // bouquet fleurs roses

  peres:         U('1485546246426-f4b8b59c3b3e', 600, 400), // whisky et montre
  bapteme:       U('1519211726170-5b0aff3e9007', 600, 400), // déco blanche douce
  ceremonie:     U('1523438885200-e635ba2c371e', 600, 400), // fleurs blanches mariage
  romantique:    U('1582657233272-66b9c5fa14a6', 600, 400), // chambre romantique led
}

// ─── Produits individuels ────────────────────────────────────────────────
export const PRODUCTS = {
  bougieLed:      U('1609348523009-a30e2591f4dc', 500),     // bougie led chaleureuse
  guirlande:      U('1482555670981-4de159d8553b', 500),     // guirlande lumineuse
  petalesRoses:   U('1565538810643-b5bdb6cc1a5b', 500),     // pétales roses rouges
  ballon:         U('1530103862676-de8c9debad1d', 500),     // ballons rouge coeur
  vase:           U('1487530811015-7d08c8bd06bb', 500),     // vase fleurs blanches
  bouquet:        U('1490750967868-88df5691cc3c', 500),     // bouquet roses roses
  coussin:        U('1555041469-149b4afc0e0d', 500),        // coussin velours rouge
  nappe:          U('1414235077428-338140e4d29b', 500),     // table dressée romantique
  photophore:     U('1519657338903-65af98c59b8b', 500),     // photophores bougies
  rideau:         U('1545127398-14699f92334b', 500),        // rideau lumière dorée
  coeurLed:       U('1607346704353-a82cec7b6fce', 500),     // coeur led lumineux
  tapis:          U('1555041469-149b4afc0e0d', 500),        // tapis velours
  miroir:         U('1618160702438-9b02ab6515c9', 500),     // miroir décoratif
  boiteChoco:     U('1549488399-3e4a67a0d897', 500),        // boîte chocolats rouges
  lanternes:      U('1520364885975-8fcd713e17e3', 500),     // lanternes flottantes
  ours:           U('1559181567-c3190460c82d', 500),        // nounours romantique
  coupe:          U('1510812431401-41d2bd2722f3', 500),     // coupe champagne
  confettis:      U('1527529482837-4698179dc6ce', 500),     // confettis colorés
  couronne:       U('1578587018452-892bacefd3d2', 500),     // couronne florale
  bougiesAromes:  U('1602028915047-37269d1a73f7', 500),     // bougies parfumées
}

// ─── Services / Décorations complètes ───────────────────────────────────
export const SERVICES = {
  chambreRomantique: U('1582657233272-66b9c5fa14a6', 800, 600),  // chambre romantique rouge/or
  chambrePrestige:   U('1631049307264-da0ec9d70304', 800, 600),  // suite luxe bougies
  mariage:           U('1518621736915-f3b1c41bfd00', 800, 600),  // salle mariage blanche
  mariageJardin:     U('1523438885200-e635ba2c371e', 800, 600),  // cérémonie extérieure
  anniversaire:      U('1516802273409-68526ee1bdd6', 800, 600),  // table anniversaire
  valentine:         U('1547592180-85f173990554', 800, 600),     // décor saint-valentin
  bapteme:           U('1519211726170-5b0aff3e9007', 800, 600),  // décor baptême doux
  fieteMeres:        U('1490750967868-88df5691cc3c', 800, 600),  // bouquets fête des mères
  soinsTables:       U('1414235077428-338140e4d29b', 800, 600),  // table fleurie
  salleFete:         U('1519741497674-611481863552', 800, 600),   // grande salle décorée
}

// ─── Galerie réalisations ────────────────────────────────────────────────
export const GALLERY = [
  { src: U('1582657233272-66b9c5fa14a6', 800, 600), cat: 'Chambre romantique',   occasion: 'Saint-Valentin' },
  { src: U('1518621736915-f3b1c41bfd00', 800, 600), cat: 'Salle de mariage',     occasion: 'Mariage' },
  { src: U('1547592180-85f173990554', 800, 600),    cat: 'Décoration bougies',    occasion: 'Anniversaire' },
  { src: U('1519741497674-611481863552', 800, 600), cat: 'Table romantique',      occasion: 'Saint-Valentin' },
  { src: U('1490750967868-88df5691cc3c', 800, 600), cat: 'Bouquet floral',        occasion: 'Fête des mères' },
  { src: U('1516802273409-68526ee1bdd6', 800, 600), cat: 'Gâteau et bougies',     occasion: 'Anniversaire' },
  { src: U('1523438885200-e635ba2c371e', 800, 600), cat: 'Cérémonie extérieure', occasion: 'Mariage' },
  { src: U('1631049307264-da0ec9d70304', 800, 600), cat: 'Suite de luxe',         occasion: 'Lune de miel' },
  { src: U('1464349095431-e9a21285b5f3', 800, 600), cat: 'Roses et bougies',     occasion: 'Saint-Valentin' },
  { src: U('1482555670981-4de159d8553b', 800, 600), cat: 'Guirlandes lumineuses', occasion: 'Baptême' },
  { src: U('1414235077428-338140e4d29b', 800, 600), cat: 'Table de cérémonie',   occasion: 'Mariage' },
  { src: U('1519211726170-5b0aff3e9007', 800, 600), cat: 'Décoration baptême',   occasion: 'Baptême' },
]

// ─── Témoignages ─────────────────────────────────────────────────────────
export const AVATARS = [
  U('1531123897727-4d75d7a1b836', 100, 100), // femme souri
  U('1507003211169-0a1dd7228f2d', 100, 100), // homme souri
  U('1494790108377-be9c29b29330', 100, 100), // femme portrait
  U('1500648767791-00dcc994a43e', 100, 100), // homme décontracté
  U('1544005313-94ddf0286df2', 100, 100),    // femme africaine
]
