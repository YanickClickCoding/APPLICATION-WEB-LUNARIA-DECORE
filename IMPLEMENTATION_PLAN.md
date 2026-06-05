# IMPLEMENTATION_PLAN — LUNARIA (React/Nest/Mongo)

## Objectif
Synchroniser l’apparence/UX du prototype `Lunaria/` vers le front React, en s’appuyant sur `_lunaria-design/` comme source (“pack final = Lunaria”). Ensuite implémenter les fonctionnalités manquantes.

## Ce que j’ai compris (baseline)
- `frontend/src/pages/public/HomePage.tsx` contient déjà une partie des animations (GSAP parallaxe + reveal).
- `frontend/src/components/animations/*` contient des composants d’animations (ParallaxHero, SplitScrollProduct, ScrollReveal).
- `_lunaria-design/screens/*` contient des écrans prototype riches :
  - client-landing, client-shop (catalogue), client-checkout (checkout), client-planning, client-account (compte), client-extra (auth/creneau/confirmation/galerie)
  - admin (dashboard/produits/commandes/devis/clients/messages/paiements)
- Les écrans `_lunaria-design` utilisent un set d’UI commun (tokens + classes .lun/.btn/.card/.ph etc.) défini dans `_lunaria-design/ui/tokens.css`.

## Plan d’implémentation (côté front React)
### Étape A — Harmoniser le design (pack Lunaria)
1. Importer/coller le fichier de tokens `_lunaria-design/ui/tokens.css` dans le front React.
2. Ajouter les classes globales nécessaires (ex: `.lun`, `.btn`, `.chip`, `.card`, `.ph`, `.divider`, `.tag`, etc.) au niveau du build React (plutôt que laisser des styles “introuvables”).
3. Créer un petit “bridge” : composants React réutilisant les classes tokens, ou bien map des composants existants vers les classes tokens.

### Étape B — Mettre à niveau l’UI des pages (fonctionnel + design)
4. Remplacer le layout de `HomePage` par le layout `_lunaria-design/screens/client-landing.jsx` (ou l’assembler étape par étape).
5. Synchroniser `CataloguePage`, `ProductPage`, `CartPage`, `CheckoutPage`, `PlanningPage`, `MessagesPage`, `AccountPage`, pages admin (si elles existent) avec les composants prototype.
6. Conserver la logique React existante (routes, appels API) et seulement remplacer la vue (presentation).

### Étape C — Implémenter les fonctionnalités manquantes
7. Comparer les features US (55 user stories) avec ce qui est réellement implementé dans `frontend/src` + `backend/src`.
8. Pour chaque gap : implémenter API Nest + page/stock React.
   - Paiements MTN MoMo / Moov Money
   - livraison / suivi temps réel (WebSocket) + notifications
   - chat temps réel
   - planification de décoration + devis + confirmation
   - favorites + avis + promotions
   - admin CRUD + modération avis

## Dépendances à vérifier
- Presence/état des routes React (React Router)
- Existence des pages admin et logique d’auth/role
- État des endpoints NestJS (controllers/services) associés aux modules

## Livrables attendus
- Design tokens alignés sur `_lunaria-design`
- Pages React alignées sur les screens prototype
- Fonctionnalités manquantes implémentées selon priorités MoSCoW

## Étapes suivantes (actionnelles)
- (1) Lire `_lunaria-design/ui/tokens.css` et l’intégrer dans React
- (2) Lire `frontend/src/pages/*` et cartographier page ↔ screen prototype
- (3) Commencer par l’écran client-landing (HomePage)

