import { Scenario } from './types';

const demoDress: Scenario = {
  id: 'demo-dress',
  name: 'Parcours Robe — Camille',
  description:
    'Découvrez comment Gally transforme l\'expérience de recherche e-commerce, à travers le parcours de Camille, une cliente à la recherche de la robe parfaite.',
  personas: {
    customer: { name: 'Camille', emoji: '👩', role: 'La cliente' },
    merchant: { name: 'Le marchand', emoji: '👔', role: 'E-commerçant' },
  },
  steps: [
    {
      act: 1,
      title: "L'arrivée",
      persona: 'camille',
      bubble: `Camille cherche <strong>"tank dress"</strong> — une requête floue. L'autocomplete comprend l'intention et propose des résultats pertinents grâce à la recherche vectorielle.
      <div class="story-tracking-hint">📊 <strong>Tracking :</strong> Gally enregistre l'événement <code>SEARCH</code> avec la requête, le nombre de résultats et la page. Cela permet d'analyser les recherches populaires, détecter les requêtes sans résultat, et améliorer l'autocomplete.</div>`,
      gain: '−40% no results',
      target: '/search?q=tank%20dress',
      spotlight: '.search-bar-wrapper',
      action: { type: 'type_and_search', query: 'tank dress', startRoute: '/' },
    },
    {
      act: 2,
      title: "L'exploration",
      persona: 'camille',
      bubble: `Camille explore les robes d'été. Les facettes — <strong>swatches couleur</strong>, <strong>slider de prix</strong>, <strong>recherche dans les options</strong> — lui permettent de trouver exactement ce qu'elle veut, sans rebond.
      <div class="story-tracking-hint">📊 <strong>Tracking :</strong> Gally enregistre <code>VIEW:category</code> (visite de catégorie) et <code>DISPLAY</code> (produits affichés avec leur position). Cela mesure la performance des catégories et le taux d'impression de chaque produit.</div>`,
      gain: 'Moins de rebond',
      target: '/category/__first__',
      spotlight: '.facets-sidebar',
      action: { type: 'highlight_sequence', selector: '.facets-sidebar', childSelector: '.facet-group', maxItems: 4, interval: 1500 },
    },
    {
      act: 3,
      title: 'Le doute',
      persona: 'merchant',
      bubble: `Le marchand hésite : comment piloter le ranking sans développeur ? L'<strong>Explain Query</strong> de Gally révèle comment chaque produit est classé — <strong>boosts</strong>, <strong>champs texte</strong>, <strong>score de pertinence</strong> — le tout pilotable sans code.
      <div class="story-tracking-hint">📊 <strong>Tracking :</strong> Les données de <code>SEARCH</code>, <code>DISPLAY</code> et <code>ADD_TO_CART</code> collectées en continu permettent à Gally de calculer un score de popularité par produit, utilisable comme critère de boost dans le merchandising.</div>`,
      gain: 'Merchandising piloté',
      target: '/explain',
      spotlight: '.explain-ranking',
      action: { type: 'highlight_sequence', selector: '.explain-results-page', childSelector: '.explain-rank-card', maxItems: 3, interval: 2500 },
    },
    {
      act: 4,
      title: 'La décision',
      persona: 'camille',
      bubble: `Camille ajoute une robe au panier. Les leviers de panier moyen entrent en jeu : <strong>pack accessoires −20%</strong>, <strong>seuil livraison offerte</strong>, <strong>fréquemment achetés ensemble</strong>.
      <div class="story-tracking-hint">📊 <strong>Tracking :</strong> Gally enregistre <code>ADD_TO_CART</code> pour chaque produit ajouté — un signal fort de conversion qui booste le produit dans les résultats. Les événements <code>VIEW:product</code> et <code>ADD_TO_CART</code> combinés alimentent les recommandations.</div>`,
      gain: '+15% panier moyen',
      target: '/search?q=tank%20dress',
      spotlight: '.products-grid',
      action: { type: 'add_to_cart_flow', searchQuery: 'tank dress' },
    },
    {
      act: 5,
      title: 'Le bilan',
      persona: 'merchant',
      bubble: `Quel impact business ? Combien de temps et de budget pour arriver là ? Découvrez le bilan <strong>coût/délai vs marché</strong>.
      <div class="story-tracking-hint">📊 <strong>Tracking :</strong> L'événement <code>ORDER</code> boucle le cycle complet : les produits achetés ensemble alimentent les recommandations "Fréquemment achetés ensemble", et le chiffre d'affaires par requête permet d'optimiser la pertinence.</div>`,
      gain: '+30% conversion',
      target: '/closing',
      action: { type: 'highlight_sequence', selector: '.tracking-timeline', childSelector: '.timeline-item', maxItems: 6, interval: 2000 },
    },
  ],
};

export default demoDress;
