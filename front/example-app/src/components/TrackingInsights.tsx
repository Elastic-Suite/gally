import { useState } from 'react';
import { useEventLog } from '../contexts/EventLogContext';

/** Maps event types to timeline-style dot colors and human labels */
const EVENT_META: Record<string, { color: string; label: string; icon: string }> = {
  'SEARCH': { color: '#3f51b5', label: 'Recherche', icon: '🔍' },
  'VIEW:category': { color: '#7c4dff', label: 'Visite catégorie', icon: '📁' },
  'VIEW:product': { color: '#7c4dff', label: 'Visite produit', icon: '👁' },
  'DISPLAY': { color: '#3949ab', label: 'Produits affichés', icon: '📋' },
  'ADD_TO_CART': { color: '#ff6b6b', label: 'Ajout panier', icon: '🛒' },
  'ORDER': { color: '#4caf50', label: 'Commande', icon: '✓' },
};

export default function TrackingInsights() {
  const [open, setOpen] = useState(false);
  const { entries } = useEventLog();

  // Group entries into insight categories
  const searches = entries.filter(e => e.type === 'SEARCH');
  const displays = entries.filter(e => e.type === 'DISPLAY');
  const categoryViews = entries.filter(e => e.type === 'VIEW:category');
  const productViews = entries.filter(e => e.type === 'VIEW:product');
  const addToCarts = entries.filter(e => e.type === 'ADD_TO_CART');
  const orders = entries.filter(e => e.type === 'ORDER');

  const totalEvents = entries.length;

  if (!open) {
    return (
      <button className="tracking-insights-toggle" onClick={() => setOpen(true)}>
        📊 Gally Insights {totalEvents > 0 && <span className="insights-badge">{totalEvents}</span>}
      </button>
    );
  }

  return (
    <div className="tracking-insights-panel">
      <div className="insights-header">
        <h3>📊 Ce que Gally sait</h3>
        <button className="insights-close" onClick={() => setOpen(false)}>✕</button>
      </div>

      <div className="insights-summary">
        <span>{totalEvents} événements captés</span>
      </div>

      {totalEvents === 0 ? (
        <div className="insights-empty">
          Naviguez dans le site pour voir Gally apprendre de vos interactions.
        </div>
      ) : (
        <div className="insights-sections">
          {searches.length > 0 && (
            <InsightSection
              icon="🔍" color="#3f51b5"
              title={`${searches.length} recherche(s)`}
              consequence="Les termes populaires remontent dans l'autocomplete. Les requêtes sans résultat sont détectées."
              details={searches.slice(0, 3).map(e => e.detail)}
            />
          )}

          {categoryViews.length > 0 && (
            <InsightSection
              icon="📁" color="#7c4dff"
              title={`${categoryViews.length} catégorie(s) visitée(s)`}
              consequence="Le contexte catégorie est mémorisé. Les actions suivantes y sont automatiquement rattachées."
              details={categoryViews.slice(0, 3).map(e => e.detail)}
            />
          )}

          {displays.length > 0 && (
            <InsightSection
              icon="📋" color="#3949ab"
              title={`${displays.length} affichage(s) de produits`}
              consequence="Gally mesure le taux d'impression et optimise le classement des produits peu vus."
              details={displays.slice(0, 3).map(e => e.detail)}
            />
          )}

          {productViews.length > 0 && (
            <InsightSection
              icon="👁" color="#7c4dff"
              title={`${productViews.length} fiche(s) produit consultée(s)`}
              consequence="Le score de popularité augmente. Ces produits seront mieux classés dans les prochaines recherches."
              details={productViews.slice(0, 3).map(e => e.detail)}
            />
          )}

          {addToCarts.length > 0 && (
            <InsightSection
              icon="🛒" color="#ff6b6b"
              title={`${addToCarts.length} ajout(s) au panier`}
              consequence="Signal fort de conversion : ces produits sont boostés dans les résultats et alimentent les recommandations."
              details={addToCarts.slice(0, 3).map(e => e.detail)}
            />
          )}

          {orders.length > 0 && (
            <InsightSection
              icon="✓" color="#4caf50"
              title={`${orders.length} commande(s)`}
              consequence="Boucle complète : alimente les recommandations 'Fréquemment achetés ensemble' et l'optimisation par revenu."
              details={orders.slice(0, 3).map(e => e.detail)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function InsightSection({ icon, color, title, consequence, details }: {
  icon: string; color: string; title: string; consequence: string; details: string[];
}) {
  return (
    <div className="insight-section">
      <div className="insight-section-header">
        <span className="insight-dot" style={{ background: color }} />
        <span className="insight-icon">{icon}</span>
        <strong>{title}</strong>
      </div>
      <div className="insight-consequence">{consequence}</div>
      {details.length > 0 && (
        <div className="insight-details">
          {details.map((d, i) => <div key={i} className="insight-detail">{d}</div>)}
        </div>
      )}
    </div>
  );
}
