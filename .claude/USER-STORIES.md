# USER STORIES — LUNARIA DÉCORATION

> Stack : React · NestJS · MongoDB  
> Paiements : MTN MoMo · Moov Money  
> Acteurs : Visiteur · Client · Administrateur · Livreur

---

## 1. CATALOGUE & NAVIGATION

### US-001 — Découverte de la boutique
**En tant que** visiteur,  
**Je veux** arriver sur une page d'accueil visuellement immersive avec des animations de scroll (effets parallaxe, produits qui se détachent et se rassemblent),  
**Afin de** ressentir l'ambiance romantique et festive de LUNARIA dès la première seconde.

### US-002 — Navigation par catégorie
**En tant que** visiteur,  
**Je veux** filtrer les produits et services par catégorie (Chambre romantique, Mariage, Anniversaire, Saint-Valentin, Fête des mères, Fête des pères, Baptême, Autres cérémonies),  
**Afin de** trouver rapidement ce qui correspond à mon occasion.

### US-003 — Fiche produit
**En tant que** visiteur,  
**Je veux** voir une fiche produit détaillée avec photos, description, prix, disponibilité et avis clients,  
**Afin de** prendre une décision d'achat éclairée.

### US-004 — Fiche service / Décoration sur mesure
**En tant que** visiteur,  
**Je veux** voir les offres de décoration clé-en-main (chambre, salle, lieu extérieur) avec photos de réalisations, tarifs et options de personnalisation,  
**Afin de** comprendre ce que LUNARIA peut créer pour mon événement.

### US-005 — Recherche
**En tant que** visiteur,  
**Je veux** rechercher un produit ou service par mot-clé,  
**Afin de** gagner du temps sans parcourir tout le catalogue.

### US-006 — Galerie de réalisations
**En tant que** visiteur,  
**Je veux** voir une galerie de photos de décorations déjà réalisées par LUNARIA,  
**Afin de** m'inspirer et avoir confiance dans la qualité du travail.

---

## 2. INSCRIPTION & AUTHENTIFICATION

### US-007 — Création de compte
**En tant que** visiteur,  
**Je veux** créer un compte avec mon nom, email et numéro de téléphone (format Bénin),  
**Afin de** passer des commandes et suivre mes achats.

### US-008 — Connexion
**En tant que** client,  
**Je veux** me connecter avec mon email/téléphone et mot de passe,  
**Afin d'** accéder à mon espace personnel.

### US-009 — Connexion rapide via OTP
**En tant que** client,  
**Je veux** recevoir un code OTP sur mon numéro de téléphone pour me connecter,  
**Afin de** ne pas avoir à retenir un mot de passe.

### US-010 — Réinitialisation de mot de passe
**En tant que** client,  
**Je veux** réinitialiser mon mot de passe via mon numéro de téléphone ou email,  
**Afin de** récupérer l'accès à mon compte.

---

## 3. PANIER & COMMANDE

### US-011 — Ajout au panier
**En tant que** visiteur ou client,  
**Je veux** ajouter un produit ou service à mon panier depuis la fiche produit,  
**Afin de** préparer ma commande.

### US-012 — Consultation du panier
**En tant que** visiteur ou client,  
**Je veux** voir le contenu de mon panier (produits, quantités, sous-total),  
**Afin de** vérifier ma sélection avant de commander.

### US-013 — Modification du panier
**En tant que** visiteur ou client,  
**Je veux** modifier les quantités ou supprimer des articles du panier,  
**Afin d'** ajuster ma commande.

### US-014 — Passage de commande
**En tant que** client,  
**Je veux** valider ma commande en choisissant l'adresse de livraison, le créneau et le mode de paiement,  
**Afin de** finaliser mon achat en quelques étapes simples.

### US-015 — Récapitulatif de commande
**En tant que** client,  
**Je veux** recevoir un récapitulatif de commande par SMS/WhatsApp après validation,  
**Afin de** garder une trace de mon achat.

---

## 4. PLANIFICATION DE DÉCORATION

### US-016 — Demande de planification
**En tant que** client,  
**Je veux** soumettre une demande de décoration en précisant : type d'événement, date, lieu, nombre de personnes, budget estimé et inspirations,  
**Afin que** l'équipe LUNARIA prépare une offre personnalisée.

### US-017 — Sélection de créneau de visite / installation
**En tant que** client,  
**Je veux** choisir un créneau disponible pour la visite préalable ou l'installation de la décoration,  
**Afin de** planifier selon mon emploi du temps.

### US-018 — Suivi de la planification
**En tant que** client,  
**Je veux** suivre l'état de ma demande de décoration (En attente · Devis envoyé · Confirmé · En cours · Livré),  
**Afin de** savoir où en est mon projet.

### US-019 — Validation du devis
**En tant que** client,  
**Je veux** accepter ou refuser le devis envoyé par LUNARIA via l'application,  
**Afin de** confirmer le projet sans avoir à me déplacer.

---

## 5. PAIEMENT

### US-020 — Paiement MTN MoMo
**En tant que** client,  
**Je veux** payer ma commande ou mon acompte via MTN Mobile Money en entrant mon numéro et en confirmant sur mon téléphone,  
**Afin de** régler rapidement et en sécurité.

### US-021 — Paiement Moov Money
**En tant que** client,  
**Je veux** payer ma commande ou mon acompte via Moov Money,  
**Afin d'** avoir une alternative de paiement mobile.

### US-022 — Acompte sur décoration
**En tant que** client,  
**Je veux** payer un acompte pour confirmer une prestation de décoration,  
**Afin de** sécuriser ma réservation.

### US-023 — Historique des paiements
**En tant que** client,  
**Je veux** voir l'historique de mes paiements avec statuts (En attente · Confirmé · Échoué),  
**Afin de** suivre mes transactions.

### US-024 — Reçu de paiement
**En tant que** client,  
**Je veux** recevoir un reçu numérique après chaque paiement réussi,  
**Afin d'** avoir une preuve de transaction.

---

## 6. LIVRAISON

### US-025 — Choix du mode de livraison
**En tant que** client,  
**Je veux** choisir entre livraison à domicile, retrait en boutique ou livraison avec installation sur site,  
**Afin d'** obtenir ma commande selon mes préférences.

### US-026 — Suivi de livraison
**En tant que** client,  
**Je veux** suivre en temps réel le statut de ma livraison (Préparé · En route · Livré),  
**Afin de** savoir quand attendre mon colis ou l'équipe de décoration.

### US-027 — Notification de livraison
**En tant que** client,  
**Je veux** recevoir une notification SMS/in-app à chaque changement de statut de livraison,  
**Afin de** ne pas rater l'arrivée du livreur.

### US-028 — Confirmation de réception
**En tant que** client,  
**Je veux** confirmer la réception de ma commande dans l'application,  
**Afin de** clôturer la livraison officiellement.

---

## 7. MESSAGERIE

### US-029 — Chat client ↔ LUNARIA
**En tant que** client,  
**Je veux** envoyer des messages directement à l'équipe LUNARIA depuis l'application,  
**Afin de** discuter des détails de ma décoration ou de ma livraison.

### US-030 — Envoi de photos dans le chat
**En tant que** client,  
**Je veux** envoyer des photos d'inspiration ou du lieu à décorer dans le chat,  
**Afin de** mieux communiquer ma vision à l'équipe.

### US-031 — Notifications de nouveaux messages
**En tant que** client,  
**Je veux** recevoir une notification quand LUNARIA m'envoie un message,  
**Afin de** ne pas rater une réponse importante.

### US-032 — Chat en temps réel
**En tant que** client et administrateur,  
**Je veux** que les messages arrivent instantanément sans recharger la page (WebSocket),  
**Afin d'** avoir une conversation fluide.

---

## 8. ESPACE CLIENT (MON COMPTE)

### US-033 — Tableau de bord client
**En tant que** client,  
**Je veux** voir un récapitulatif de mes commandes, planifications en cours et messages non lus,  
**Afin d'** avoir une vue d'ensemble de mon activité sur LUNARIA.

### US-034 — Historique des commandes
**En tant que** client,  
**Je veux** voir toutes mes commandes passées avec détails et statuts,  
**Afin de** retrouver une commande ou la recommander.

### US-035 — Avis et notation
**En tant que** client,  
**Je veux** laisser un avis et une note après la réalisation d'une décoration ou la réception d'un produit,  
**Afin de** partager mon expérience et aider les autres visiteurs.

### US-036 — Produits favoris
**En tant que** client,  
**Je veux** sauvegarder des produits en favoris,  
**Afin de** les retrouver facilement pour une prochaine occasion.

---

## 9. INTERFACE ADMINISTRATION

### US-037 — Tableau de bord admin
**En tant qu'** administrateur,  
**Je veux** voir les KPIs clés (commandes du jour, chiffre d'affaires, messages non traités, planifications en attente),  
**Afin de** piloter l'activité quotidienne.

### US-038 — Gestion des produits
**En tant qu'** administrateur,  
**Je veux** créer, modifier, archiver et supprimer des produits avec photos, prix, stock et catégorie,  
**Afin de** maintenir le catalogue à jour.

### US-039 — Gestion des services / décorations
**En tant qu'** administrateur,  
**Je veux** créer et gérer les offres de décoration (nom, description, photos, tarif de base, options),  
**Afin de** présenter les prestations correctement aux clients.

### US-040 — Gestion des commandes
**En tant qu'** administrateur,  
**Je veux** voir toutes les commandes, les filtrer par statut et les mettre à jour,  
**Afin de** traiter les commandes efficacement.

### US-041 — Gestion des planifications
**En tant qu'** administrateur,  
**Je veux** voir les demandes de décoration, envoyer des devis, confirmer ou refuser,  
**Afin de** gérer le calendrier des prestations.

### US-042 — Gestion des livraisons
**En tant qu'** administrateur,  
**Je veux** assigner des livraisons, mettre à jour les statuts et gérer les livreurs,  
**Afin d'** assurer la qualité des livraisons.

### US-043 — Gestion des paiements
**En tant qu'** administrateur,  
**Je veux** voir les transactions, confirmer les paiements manuels et gérer les remboursements,  
**Afin de** contrôler la trésorerie.

### US-044 — Messagerie admin
**En tant qu'** administrateur,  
**Je veux** répondre aux messages des clients depuis l'interface admin,  
**Afin de** gérer toutes les conversations en un seul endroit.

### US-045 — Gestion des utilisateurs
**En tant qu'** administrateur,  
**Je veux** voir la liste des clients, leurs commandes et leur historique,  
**Afin de** les accompagner en cas de besoin.

### US-046 — Gestion des promotions
**En tant qu'** administrateur,  
**Je veux** créer des codes promo, des offres spéciales (Saint-Valentin, Fête des mères) et des bannières,  
**Afin d'** animer commercialement le site.

### US-047 — Gestion des avis
**En tant qu'** administrateur,  
**Je veux** modérer les avis clients (valider, masquer),  
**Afin de** maintenir la qualité et la fiabilité des témoignages affichés.

---

## 10. EXPÉRIENCE VISITEUR & CONVERSION

### US-048 — Pop-up d'offre de bienvenue
**En tant que** visiteur,  
**Je veux** voir une offre de bienvenue attrayante (réduction première commande),  
**Afin d'** être incité à créer un compte.

### US-049 — Animations de scroll (Parallaxe / Split)
**En tant que** visiteur,  
**Je veux** voir des animations fluides où les produits se détachent, se déplacent et se rassemblent au scroll,  
**Afin de** vivre une expérience visuelle mémorable et rester plus longtemps sur le site.

### US-050 — Section témoignages animée
**En tant que** visiteur,  
**Je veux** voir des témoignages clients avec photos de leurs décorations,  
**Afin d'** être rassuré sur la qualité de LUNARIA.

### US-051 — FAQ interactive
**En tant que** visiteur,  
**Je veux** trouver des réponses aux questions fréquentes (délais, zones de livraison, prix minimum, etc.),  
**Afin de** ne pas avoir à contacter le service client pour des questions simples.

### US-052 — Site responsive mobile-first
**En tant que** visiteur sur mobile,  
**Je veux** naviguer confortablement sur le site depuis mon téléphone,  
**Afin de** commander à tout moment.

### US-053 — Mode sombre (Dark mode)
**En tant que** visiteur,  
**Je veux** basculer en mode sombre,  
**Afin d'** améliorer mon confort visuel.

---

## 11. NOTIFICATIONS

### US-054 — Notifications in-app
**En tant que** client,  
**Je veux** recevoir des notifications dans l'application pour tout événement (message, statut commande, paiement),  
**Afin d'** être informé sans quitter l'application.

### US-055 — Notifications SMS
**En tant que** client,  
**Je veux** recevoir des SMS pour les confirmations critiques (commande validée, paiement reçu, livraison en route),  
**Afin d'** être informé même sans connexion internet.

---

## RÉCAPITULATIF

| Module | Nb US |
|--------|-------|
| Catalogue & Navigation | 6 |
| Inscription & Auth | 4 |
| Panier & Commande | 5 |
| Planification de Décoration | 4 |
| Paiement | 5 |
| Livraison | 4 |
| Messagerie | 4 |
| Espace Client | 4 |
| Administration | 11 |
| Expérience & Conversion | 6 |
| Notifications | 2 |
| **TOTAL** | **55** |

---

## PRIORITÉS (MoSCoW)

### Must Have (MVP)
US-001, US-002, US-003, US-004, US-007, US-008, US-011, US-012, US-013, US-014,
US-016, US-017, US-020, US-021, US-025, US-029, US-037, US-038, US-039, US-040,
US-041, US-042, US-043, US-052

### Should Have
US-005, US-006, US-009, US-015, US-018, US-019, US-022, US-023, US-026, US-027,
US-030, US-031, US-032, US-033, US-034, US-044, US-045, US-049, US-054, US-055

### Could Have
US-010, US-024, US-028, US-035, US-036, US-046, US-047, US-048, US-050, US-051, US-053

### Won't Have (V1)
US-053 (si complexe), intégrations réseaux sociaux, app mobile native
