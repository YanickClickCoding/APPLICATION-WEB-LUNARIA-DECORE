# SCHÉMAS MONGODB — LUNARIA DÉCORATION

> ORM : Mongoose · Base : `lunaria`

---

## User
```typescript
{
  _id: ObjectId,
  firstName: String,           // Prénom
  lastName: String,            // Nom
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true },  // +229XXXXXXXX
  password: String,            // bcrypt hash
  role: { enum: ['CLIENT', 'ADMIN', 'LIVREUR'], default: 'CLIENT' },
  avatar: String,              // URL Cloudinary
  address: {
    quartier: String,
    ville: String,
    commune: String,
    indications: String,       // Repères GPS / description
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  otpCode: String,
  otpExpires: Date,
  favorites: [{ type: ObjectId, ref: 'Product' }],
  createdAt: Date,
  updatedAt: Date,
}
```

---

## Category
```typescript
{
  _id: ObjectId,
  name: String,               // ex: "Mariage", "Saint-Valentin"
  slug: { type: String, unique: true },
  description: String,
  image: String,              // URL Cloudinary
  icon: String,               // Nom icône (Lucide)
  isActive: { type: Boolean, default: true },
  order: Number,              // Ordre d'affichage
  createdAt: Date,
  updatedAt: Date,
}
```

---

## Product
```typescript
{
  _id: ObjectId,
  name: String,
  slug: { type: String, unique: true },
  description: String,
  shortDescription: String,
  price: Number,              // en FCFA
  comparePrice: Number,       // prix barré (optionnel)
  images: [String],           // URLs Cloudinary
  category: { type: ObjectId, ref: 'Category' },
  tags: [String],             // ["romantique", "bougies", "mariage"]
  stock: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  weight: Number,             // grammes (pour calcul livraison)
  createdAt: Date,
  updatedAt: Date,
}
```

---

## DecorationService
```typescript
{
  _id: ObjectId,
  name: String,               // ex: "Chambre Romantique Prestige"
  slug: { type: String, unique: true },
  description: String,
  shortDescription: String,
  category: { type: ObjectId, ref: 'Category' },
  basePrice: Number,          // Prix de base en FCFA
  priceNote: String,          // ex: "À partir de 25 000 FCFA"
  images: [String],
  includes: [String],         // ["Bougies LED", "Pétales de roses", ...]
  options: [{
    name: String,             // ex: "Bouquet en supplément"
    price: Number,
  }],
  duration: String,           // ex: "2h d'installation"
  isAvailable: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  createdAt: Date,
  updatedAt: Date,
}
```

---

## Cart
```typescript
{
  _id: ObjectId,
  user: { type: ObjectId, ref: 'User' },    // null si visiteur
  sessionId: String,                         // pour visiteurs non connectés
  items: [{
    product: { type: ObjectId, ref: 'Product' },
    service: { type: ObjectId, ref: 'DecorationService' },
    quantity: Number,
    price: Number,             // prix au moment de l'ajout
    selectedOptions: [String], // options choisies pour un service
  }],
  total: Number,
  expiresAt: Date,             // TTL pour les paniers anonymes
  updatedAt: Date,
}
```

---

## Order
```typescript
{
  _id: ObjectId,
  orderNumber: { type: String, unique: true }, // ex: "LUN-2025-00042"
  client: { type: ObjectId, ref: 'User' },
  items: [{
    product: { type: ObjectId, ref: 'Product' },
    service: { type: ObjectId, ref: 'DecorationService' },
    name: String,              // snapshot nom au moment de la commande
    price: Number,             // snapshot prix
    quantity: Number,
    image: String,
    selectedOptions: [String],
  }],
  subtotal: Number,
  deliveryFee: Number,
  discount: Number,
  total: Number,
  promoCode: String,
  status: {
    type: String,
    enum: ['EN_ATTENTE', 'CONFIRME', 'EN_PREPARATION', 'PRET', 'EN_LIVRAISON', 'LIVRE', 'ANNULE'],
    default: 'EN_ATTENTE',
  },
  deliveryAddress: {
    quartier: String,
    ville: String,
    commune: String,
    indications: String,
    phone: String,
  },
  deliveryType: { enum: ['DOMICILE', 'RETRAIT_BOUTIQUE', 'INSTALLATION_SITE'] },
  payment: { type: ObjectId, ref: 'Payment' },
  delivery: { type: ObjectId, ref: 'Delivery' },
  notes: String,              // instructions spéciales du client
  statusHistory: [{
    status: String,
    date: Date,
    note: String,
  }],
  createdAt: Date,
  updatedAt: Date,
}
```

---

## DecorationPlanning
```typescript
{
  _id: ObjectId,
  planningNumber: { type: String, unique: true }, // ex: "PLAN-2025-00015"
  client: { type: ObjectId, ref: 'User' },
  service: { type: ObjectId, ref: 'DecorationService' },
  eventType: String,           // ex: "Mariage", "Anniversaire"
  eventDate: Date,
  eventLocation: {
    type: String,              // ex: "Domicile", "Salle de fête"
    address: String,
    ville: String,
    indications: String,
  },
  guestCount: Number,
  budgetMin: Number,
  budgetMax: Number,
  inspirations: [String],      // URLs photos d'inspiration
  description: String,         // Détails supplémentaires
  status: {
    type: String,
    enum: ['EN_ATTENTE', 'DEVIS_ENVOYE', 'DEVIS_ACCEPTE', 'DEVIS_REFUSE', 'CONFIRME', 'EN_COURS', 'TERMINE', 'ANNULE'],
    default: 'EN_ATTENTE',
  },
  visitSlot: {
    date: Date,
    timeSlot: String,          // ex: "09:00 - 11:00"
  },
  installationSlot: {
    date: Date,
    timeSlot: String,
  },
  quote: {
    amount: Number,
    description: String,
    validUntil: Date,
    sentAt: Date,
    respondedAt: Date,
  },
  payment: { type: ObjectId, ref: 'Payment' },
  assignedTo: { type: ObjectId, ref: 'User' }, // Décorateur assigné
  statusHistory: [{
    status: String,
    date: Date,
    note: String,
  }],
  createdAt: Date,
  updatedAt: Date,
}
```

---

## Payment
```typescript
{
  _id: ObjectId,
  paymentNumber: { type: String, unique: true },
  client: { type: ObjectId, ref: 'User' },
  order: { type: ObjectId, ref: 'Order' },
  planning: { type: ObjectId, ref: 'DecorationPlanning' },
  amount: Number,              // FCFA
  currency: { type: String, default: 'XOF' },
  method: { enum: ['MTN_MOMO', 'MOOV_MONEY'] },
  type: { enum: ['COMMANDE', 'ACOMPTE', 'SOLDE'] },
  status: {
    type: String,
    enum: ['EN_ATTENTE', 'EN_COURS', 'CONFIRME', 'ECHOUE', 'REMBOURSE'],
    default: 'EN_ATTENTE',
  },
  phone: String,               // Numéro utilisé pour payer
  transactionId: String,       // ID retourné par MTN/Moov
  externalRef: String,         // Notre référence envoyée à l'API
  metadata: Object,            // Réponse brute de l'API paiement
  paidAt: Date,
  failReason: String,
  createdAt: Date,
  updatedAt: Date,
}
```

---

## Delivery
```typescript
{
  _id: ObjectId,
  order: { type: ObjectId, ref: 'Order' },
  livreur: { type: ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['EN_ATTENTE', 'ASSIGNE', 'RECUPERE', 'EN_ROUTE', 'LIVRE', 'ECHEC'],
    default: 'EN_ATTENTE',
  },
  address: {
    quartier: String,
    ville: String,
    commune: String,
    indications: String,
    phone: String,
  },
  estimatedDate: Date,
  deliveredAt: Date,
  notes: String,
  statusHistory: [{
    status: String,
    date: Date,
    note: String,
  }],
  createdAt: Date,
  updatedAt: Date,
}
```

---

## Conversation
```typescript
{
  _id: ObjectId,
  participants: [{ type: ObjectId, ref: 'User' }],
  order: { type: ObjectId, ref: 'Order' },           // optionnel
  planning: { type: ObjectId, ref: 'DecorationPlanning' }, // optionnel
  subject: String,            // ex: "Décoration mariage 12 Jan"
  lastMessage: {
    content: String,
    sentAt: Date,
    senderId: ObjectId,
  },
  unreadCount: {
    type: Map,
    of: Number,               // { userId: nombreNonLus }
  },
  isArchived: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date,
}
```

---

## Message
```typescript
{
  _id: ObjectId,
  conversation: { type: ObjectId, ref: 'Conversation' },
  sender: { type: ObjectId, ref: 'User' },
  type: { enum: ['TEXT', 'IMAGE', 'DOCUMENT', 'SYSTEM'], default: 'TEXT' },
  content: String,
  attachments: [{
    url: String,
    name: String,
    type: String,             // 'image/jpeg', 'application/pdf'...
    size: Number,
  }],
  readBy: [{ type: ObjectId, ref: 'User' }],
  isDeleted: { type: Boolean, default: false },
  createdAt: Date,
}
```

---

## Notification
```typescript
{
  _id: ObjectId,
  user: { type: ObjectId, ref: 'User' },
  type: {
    enum: [
      'COMMANDE_CONFIRMEE', 'COMMANDE_LIVREE',
      'PAIEMENT_CONFIRME', 'PAIEMENT_ECHOUE',
      'DEVIS_RECU', 'PLANNING_CONFIRME',
      'NOUVEAU_MESSAGE', 'LIVRAISON_EN_ROUTE',
    ],
  },
  title: String,
  body: String,
  data: Object,               // { orderId, planningId... }
  isRead: { type: Boolean, default: false },
  readAt: Date,
  createdAt: Date,
}
```

---

## Review
```typescript
{
  _id: ObjectId,
  client: { type: ObjectId, ref: 'User' },
  product: { type: ObjectId, ref: 'Product' },
  service: { type: ObjectId, ref: 'DecorationService' },
  order: { type: ObjectId, ref: 'Order' },
  rating: { type: Number, min: 1, max: 5 },
  title: String,
  comment: String,
  images: [String],           // Photos du client
  status: { enum: ['EN_ATTENTE', 'APPROUVE', 'REFUSE'], default: 'EN_ATTENTE' },
  approvedAt: Date,
  createdAt: Date,
  updatedAt: Date,
}
```

---

## PromoCode
```typescript
{
  _id: ObjectId,
  code: { type: String, unique: true },
  description: String,        // ex: "Saint-Valentin 2025"
  type: { enum: ['POURCENTAGE', 'MONTANT_FIXE'] },
  value: Number,              // 20 = 20% ou 2000 FCFA
  minOrderAmount: Number,
  maxUses: Number,
  usedCount: { type: Number, default: 0 },
  usedBy: [{ type: ObjectId, ref: 'User' }],
  validFrom: Date,
  validUntil: Date,
  isActive: { type: Boolean, default: true },
  createdAt: Date,
}
```

---

## INDEX MONGODB (Performance)

```javascript
// User
db.users.createIndex({ email: 1 }, { unique: true, sparse: true })
db.users.createIndex({ phone: 1 }, { unique: true })

// Product
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ category: 1, isAvailable: 1 })
db.products.createIndex({ name: 'text', description: 'text', tags: 'text' })

// Order
db.orders.createIndex({ orderNumber: 1 }, { unique: true })
db.orders.createIndex({ client: 1, createdAt: -1 })
db.orders.createIndex({ status: 1 })

// DecorationPlanning
db.decorationplannings.createIndex({ client: 1, createdAt: -1 })
db.decorationplannings.createIndex({ eventDate: 1, status: 1 })

// Payment
db.payments.createIndex({ transactionId: 1 })
db.payments.createIndex({ client: 1, createdAt: -1 })

// Message
db.messages.createIndex({ conversation: 1, createdAt: 1 })

// Notification
db.notifications.createIndex({ user: 1, isRead: 1, createdAt: -1 })
```
