/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   DirectionBoard, Landing, Catalogue, Fiche, Panier, Checkout, PaiementMoMo,
   Planification, Suivi, Chat, Compte, HeroLight, HeroDark, HeroCoral,
   AdminDashboard, AdminProduits,
   Auth, Creneau, Confirmation, Galerie,
   AdminCommande, AdminDevis, AdminClients, AdminMessages, AdminPaiements */

function App() {
  return (
    <DesignCanvas>
      <DCSection id="direction" title="Direction visuelle" subtitle="Le système : couleurs, typographie, composants">
        <DCArtboard id="style-tile" label="Style tile" width={1280} height={1460}>
          <DirectionBoard />
        </DCArtboard>
      </DCSection>

      <DCSection id="client" title="Parcours client" subtitle="Vitrine → boutique → commande → suivi">
        <DCArtboard id="landing" label="01 · Landing immersive" width={1280} height={3780}>
          <Landing />
        </DCArtboard>
        <DCArtboard id="catalogue" label="02 · Catalogue + filtres" width={1280} height={1180}>
          <Catalogue />
        </DCArtboard>
        <DCArtboard id="fiche" label="03 · Fiche produit + avis" width={1280} height={1180}>
          <Fiche />
        </DCArtboard>
        <DCArtboard id="planif" label="04 · Planification sur mesure" width={1280} height={1060}>
          <Planification />
        </DCArtboard>
        <DCArtboard id="panier" label="05 · Panier" width={1280} height={780}>
          <Panier />
        </DCArtboard>
        <DCArtboard id="checkout" label="06 · Checkout (livraison)" width={1280} height={840}>
          <Checkout />
        </DCArtboard>
        <DCArtboard id="creneau" label="06b · Créneau de livraison" width={1280} height={820}>
          <Creneau />
        </DCArtboard>
        <DCArtboard id="momo" label="07 · Paiement Mobile Money" width={1280} height={860}>
          <PaiementMoMo />
        </DCArtboard>
        <DCArtboard id="confirmation" label="08 · Confirmation de commande" width={1280} height={820}>
          <Confirmation />
        </DCArtboard>
        <DCArtboard id="suivi" label="08 · Suivi livraison" width={1280} height={820}>
          <Suivi />
        </DCArtboard>
        <DCArtboard id="chat" label="09 · Chat conseiller" width={760} height={820}>
          <Chat />
        </DCArtboard>
        <DCArtboard id="compte" label="10 · Espace client" width={1280} height={820}>
          <Compte />
        </DCArtboard>
        <DCArtboard id="auth" label="11 · Connexion / Inscription" width={1280} height={820}>
          <Auth />
        </DCArtboard>
        <DCArtboard id="galerie" label="12 · Galerie réalisations" width={1280} height={1580}>
          <Galerie />
        </DCArtboard>
      </DCSection>

      <DCSection id="variations" title="Variations · Hero" subtitle="Trois directions à comparer (couleur, layout, type)">
        <DCArtboard id="v-light" label="A · Ivoire éditorial" width={1280} height={720}>
          <HeroLight />
        </DCArtboard>
        <DCArtboard id="v-dark" label="B · Nuit centrée" width={1280} height={720}>
          <HeroDark />
        </DCArtboard>
        <DCArtboard id="v-coral" label="C · Bloc corail" width={1280} height={720}>
          <HeroCoral />
        </DCArtboard>
      </DCSection>

      <DCSection id="admin" title="Administration" subtitle="Dashboard, produits, commandes">
        <DCArtboard id="admin-dash" label="Dashboard · KPIs & ventes" width={1280} height={1060}>
          <AdminDashboard />
        </DCArtboard>
        <DCArtboard id="admin-prod" label="Gestion des produits" width={1280} height={820}>
          <AdminProduits />
        </DCArtboard>
        <DCArtboard id="admin-cmd" label="Détail commande" width={1280} height={1020}>
          <AdminCommande />
        </DCArtboard>
        <DCArtboard id="admin-devis" label="Devis & planifications" width={1280} height={860}>
          <AdminDevis />
        </DCArtboard>
        <DCArtboard id="admin-clients" label="Clients" width={1280} height={820}>
          <AdminClients />
        </DCArtboard>
        <DCArtboard id="admin-msg" label="Messages" width={1280} height={860}>
          <AdminMessages />
        </DCArtboard>
        <DCArtboard id="admin-pay" label="Paiements" width={1280} height={860}>
          <AdminPaiements />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
