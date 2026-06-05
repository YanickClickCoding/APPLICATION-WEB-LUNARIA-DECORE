# ARCHITECTURE TECHNIQUE — LUNARIA DÉCORATION

> Stack : React 18 · NestJS 10 · MongoDB · Socket.IO · JWT · MTN MoMo · Moov Money

---

## 1. VUE D'ENSEMBLE

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                    │
│              React 18 + Vite + TailwindCSS              │
│         React Router · Zustand · React Query            │
└────────────────────────┬────────────────────────────────┘
                         │  REST API + WebSocket
┌────────────────────────▼────────────────────────────────┐
│                  BACKEND (NestJS 10)                    │
│         REST API · WebSocket (Socket.IO) · JWT          │
│    Guards · Pipes · Interceptors · Swagger Docs         │
└──────┬────────────────┬────────────────┬────────────────┘
       │                │                │
┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼──────────────┐
│  MongoDB    │  │   Redis     │  │  Services externes  │
│  Mongoose   │  │  (Sessions  │  │  MTN MoMo API       │
│             │  │   + Cache)  │  │  Moov Money API     │
└─────────────┘  └─────────────┘  │  SMS Gateway        │
                                  │  Cloudinary (images)│
                                  └────────────────────┘
```

---

## 2. STRUCTURE DU PROJET

```
lunaria/
├── frontend/                   # React App
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/             # Composants réutilisables
│   │   │   ├── layout/         # Navbar, Footer, Sidebar
│   │   │   ├── product/        # ProductCard, ProductGrid...
│   │   │   ├── cart/           # CartDrawer, CartItem...
│   │   │   ├── chat/           # ChatBox, MessageBubble...
│   │   │   ├── animations/     # ScrollReveal, ParallaxSplit...
│   │   │   └── admin/          # Tableaux, formulaires admin
│   │   ├── pages/
│   │   │   ├── public/         # Home, Catalogue, Produit...
│   │   │   ├── client/         # MonCompte, Commandes...
│   │   │   └── admin/          # Dashboard, Produits, Orders...
│   │   ├── hooks/              # useCart, useAuth, useChat...
│   │   ├── stores/             # Zustand stores
│   │   ├── services/           # Appels API (axios)
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/
│   └── package.json
│
├── backend/                    # NestJS App
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── services/           # Services de décoration
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── planning/           # Planification décoration
│   │   ├── payments/
│   │   ├── delivery/
│   │   ├── messaging/          # WebSocket + Chat
│   │   ├── notifications/      # SMS + In-app
│   │   ├── reviews/
│   │   ├── upload/             # Cloudinary
│   │   ├── admin/
│   │   └── common/             # Guards, Pipes, Interceptors
│   └── package.json
│
└── docker-compose.yml
```

---

## 3. MODULES NESTJS

### 3.1 AuthModule
```
POST /auth/register          → Inscription (nom, email, téléphone, mdp)
POST /auth/login             → Connexion email/mdp → JWT
POST /auth/otp/send          → Envoi OTP par SMS
POST /auth/otp/verify        → Vérification OTP → JWT
POST /auth/refresh           → Refresh token
POST /auth/logout
GET  /auth/me                → Profil utilisateur connecté
```

### 3.2 UsersModule
```
GET    /users                → Liste clients (Admin)
GET    /users/:id            → Détail client
PATCH  /users/:id            → Mise à jour profil
DELETE /users/:id            → Suppression (Admin)
GET    /users/:id/orders     → Commandes d'un client
```

### 3.3 CategoriesModule
```
GET    /categories           → Liste des catégories
POST   /categories           → Créer (Admin)
PATCH  /categories/:id       → Modifier (Admin)
DELETE /categories/:id       → Supprimer (Admin)
```

### 3.4 ProductsModule
```
GET    /products             → Liste avec filtres (catégorie, prix, dispo)
GET    /products/:id         → Détail produit
POST   /products             → Créer (Admin)
PATCH  /products/:id         → Modifier (Admin)
DELETE /products/:id         → Archiver (Admin)
GET    /products/featured    → Produits mis en avant
```

### 3.5 ServicesModule (Décorations)
```
GET    /services             → Liste des offres de décoration
GET    /services/:id         → Détail service
POST   /services             → Créer (Admin)
PATCH  /services/:id         → Modifier (Admin)
DELETE /services/:id         → Archiver (Admin)
```

### 3.6 CartModule
```
GET    /cart                 → Panier de l'utilisateur connecté
POST   /cart/items           → Ajouter un article
PATCH  /cart/items/:id       → Modifier quantité
DELETE /cart/items/:id       → Supprimer un article
DELETE /cart                 → Vider le panier
```

### 3.7 OrdersModule
```
POST   /orders               → Créer une commande depuis le panier
GET    /orders               → Mes commandes (Client) / Toutes (Admin)
GET    /orders/:id           → Détail commande
PATCH  /orders/:id/status    → Changer statut (Admin)
POST   /orders/:id/cancel    → Annuler commande (Client)
```

### 3.8 PlanningModule (Planification décoration)
```
POST   /planning             → Soumettre une demande de décoration
GET    /planning             → Mes demandes (Client) / Toutes (Admin)
GET    /planning/:id         → Détail d'une demande
POST   /planning/:id/quote   → Envoyer un devis (Admin)
PATCH  /planning/:id/accept  → Accepter le devis (Client)
PATCH  /planning/:id/reject  → Refuser le devis (Client)
PATCH  /planning/:id/status  → Mettre à jour statut (Admin)
GET    /planning/slots        → Créneaux disponibles
```

### 3.9 PaymentsModule
```
POST   /payments/mtn-momo/initiate   → Initier paiement MTN MoMo
POST   /payments/mtn-momo/callback   → Webhook MTN
POST   /payments/moov/initiate       → Initier paiement Moov Money
POST   /payments/moov/callback       → Webhook Moov
GET    /payments                     → Historique paiements
GET    /payments/:id                 → Détail paiement
```

### 3.10 DeliveryModule
```
GET    /delivery             → Liste livraisons
GET    /delivery/:id         → Détail livraison
PATCH  /delivery/:id/status  → Mettre à jour statut
POST   /delivery/:id/assign  → Assigner livreur (Admin)
POST   /delivery/:id/confirm → Confirmer réception (Client)
```

### 3.11 MessagingModule (WebSocket)
```
GET    /conversations              → Mes conversations
GET    /conversations/:id/messages → Messages d'une conversation
POST   /conversations/:id/messages → Envoyer message (REST fallback)

WebSocket Events :
  Client → Serveur :
    join_conversation  { conversationId }
    send_message       { conversationId, content, type }
    typing             { conversationId }

  Serveur → Client :
    new_message        { message }
    user_typing        { userId }
    message_read       { messageId }
```

### 3.12 NotificationsModule
```
GET    /notifications        → Mes notifications
PATCH  /notifications/read   → Marquer comme lues
DELETE /notifications/:id    → Supprimer
```

### 3.13 ReviewsModule
```
POST   /reviews              → Laisser un avis
GET    /reviews/product/:id  → Avis d'un produit
PATCH  /reviews/:id/approve  → Valider (Admin)
DELETE /reviews/:id          → Supprimer (Admin)
```

### 3.14 UploadModule
```
POST   /upload/image         → Upload image → Cloudinary → URL
DELETE /upload/:publicId     → Supprimer image
```

---

## 4. PAGES REACT

### Public
| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Hero animé, produits vedettes, témoignages |
| `/catalogue` | `CataloguePage` | Grille produits + filtres |
| `/produit/:id` | `ProductPage` | Fiche produit détaillée |
| `/services` | `ServicesPage` | Offres de décoration |
| `/service/:id` | `ServicePage` | Détail d'une offre |
| `/galerie` | `GaleriePage` | Réalisations LUNARIA |
| `/connexion` | `LoginPage` | Connexion / Inscription |

### Client (protégées)
| Route | Composant | Description |
|-------|-----------|-------------|
| `/panier` | `CartPage` | Panier détaillé |
| `/commande` | `CheckoutPage` | Tunnel de commande |
| `/paiement/:id` | `PaymentPage` | Page paiement mobile |
| `/compte` | `AccountPage` | Tableau de bord client |
| `/compte/commandes` | `OrdersPage` | Historique commandes |
| `/compte/planification` | `PlanningPage` | Mes projets de décoration |
| `/compte/messages` | `MessagesPage` | Messagerie |
| `/compte/favoris` | `FavoritesPage` | Produits favoris |

### Admin (protégées + rôle ADMIN)
| Route | Composant | Description |
|-------|-----------|-------------|
| `/admin` | `AdminDashboard` | KPIs et stats |
| `/admin/produits` | `AdminProducts` | CRUD produits |
| `/admin/services` | `AdminServices` | CRUD services |
| `/admin/commandes` | `AdminOrders` | Gestion commandes |
| `/admin/planification` | `AdminPlanning` | Gestion décorations |
| `/admin/livraisons` | `AdminDelivery` | Gestion livraisons |
| `/admin/paiements` | `AdminPayments` | Transactions |
| `/admin/messages` | `AdminMessages` | Messagerie admin |
| `/admin/clients` | `AdminUsers` | Gestion clients |
| `/admin/avis` | `AdminReviews` | Modération avis |
| `/admin/promotions` | `AdminPromos` | Codes promo |

---

## 5. ZUSTAND STORES

```typescript
// stores/useAuthStore.ts
{ user, token, isAuthenticated, login(), logout(), updateProfile() }

// stores/useCartStore.ts
{ items, total, addItem(), removeItem(), updateQty(), clear() }

// stores/useNotificationStore.ts
{ notifications, unreadCount, markRead(), addNotification() }

// stores/useChatStore.ts
{ conversations, activeConversation, messages, sendMessage() }
```

---

## 6. ANIMATIONS (GSAP + Framer Motion)

### Scroll Split — Produit qui se détache
```
Bibliothèques : GSAP + ScrollTrigger
Effet : Au scroll, les éléments d'un produit (image, titre, prix)
        se séparent dans différentes directions puis se rassemblent
        quand on arrive sur la section.
```

### Parallaxe Hero
```
Bibliothèque : Framer Motion (useScroll + useTransform)
Effet : L'image de fond se déplace plus lentement que le contenu
        pour donner de la profondeur.
```

### Reveal au scroll
```
Bibliothèque : Framer Motion (whileInView)
Effet : Les cartes et sections apparaissent avec un fondu + translation
        douce au moment où elles entrent dans le viewport.
```

---

## 7. SÉCURITÉ

- **JWT** (Access Token 15min + Refresh Token 7j)
- **Guards NestJS** : `JwtAuthGuard`, `RolesGuard` (CLIENT, ADMIN, LIVREUR)
- **Helmet** : headers HTTP sécurisés
- **Rate Limiting** : 100 req/min par IP (throttler)
- **Validation** : `class-validator` sur tous les DTOs
- **CORS** : origines autorisées uniquement
- **Sanitisation** : inputs nettoyés contre XSS/injection NoSQL
- **Variables d'environnement** : `.env` jamais commité

---

## 8. VARIABLES D'ENVIRONNEMENT

```env
# Backend .env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lunaria
JWT_SECRET=...
JWT_REFRESH_SECRET=...
REDIS_URL=redis://localhost:6379

# Paiements
MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_SUBSCRIPTION_KEY=...
MTN_MOMO_API_USER=...
MTN_MOMO_API_KEY=...
MOOV_MONEY_API_URL=...
MOOV_MONEY_API_KEY=...

# SMS
SMS_GATEWAY_URL=...
SMS_API_KEY=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Frontend .env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```
