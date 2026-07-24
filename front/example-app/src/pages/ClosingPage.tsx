import { useState } from 'react';

export default function ClosingPage() {
  const [revealStage, setRevealStage] = useState(0); // 0=delay, 1=cost, 2=pricing

  return (
    <div className="closing-page">
      <div className="page-title">
        <h1>Le Bilan</h1>
      </div>

      {/* Stats band */}
      <div className="closing-stats">
        <div className="closing-stat">
          <span className="closing-stat-value coral">−40%</span>
          <span className="closing-stat-label">Pages "aucun résultat"</span>
        </div>
        <div className="closing-stat">
          <span className="closing-stat-value">+30%</span>
          <span className="closing-stat-label">Taux de conversion</span>
        </div>
        <div className="closing-stat">
          <span className="closing-stat-value">+15%</span>
          <span className="closing-stat-label">Panier moyen</span>
        </div>
      </div>

      {/* Tracking Journey Timeline */}
      <div className="closing-card" style={{ marginBottom: '2rem' }}>
        <h3>📊 Ce que Gally a appris pendant le parcours</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
          Chaque interaction de Camille a été captée. Voici comment ces données améliorent l'expérience pour les prochains visiteurs.
        </p>
        <div className="tracking-timeline">
          <div className="timeline-item">
            <div className="timeline-dot search" />
            <div className="timeline-content">
              <div className="timeline-event">
                <span className="timeline-badge">SEARCH</span>
                Camille recherche <strong>"tank dress"</strong>
              </div>
              <div className="timeline-consequence">
                → Gally enregistre la requête et le nombre de résultats. Les termes populaires remontent dans l'autocomplete. Les requêtes sans résultat sont détectées pour enrichir le catalogue.
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot display" />
            <div className="timeline-content">
              <div className="timeline-event">
                <span className="timeline-badge">DISPLAY</span>
                12 produits affichés avec leur position
              </div>
              <div className="timeline-consequence">
                → Gally mesure le taux d'impression de chaque produit. Les produits vus mais jamais cliqués sont identifiés pour ajuster leur ranking.
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot view" />
            <div className="timeline-content">
              <div className="timeline-event">
                <span className="timeline-badge">VIEW:category</span>
                Camille visite la catégorie Robes
              </div>
              <div className="timeline-consequence">
                → Le contexte "catégorie" est mémorisé pour la session. Toutes les actions suivantes sont automatiquement rattachées à cette catégorie.
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot view" />
            <div className="timeline-content">
              <div className="timeline-event">
                <span className="timeline-badge">VIEW:product</span>
                Camille consulte une fiche produit
              </div>
              <div className="timeline-consequence">
                → Le score de popularité du produit augmente. Gally utilise ce signal pour mieux classer ce produit dans les prochaines recherches similaires.
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot cart" />
            <div className="timeline-content">
              <div className="timeline-event">
                <span className="timeline-badge">ADD_TO_CART</span>
                Camille ajoute le produit au panier
              </div>
              <div className="timeline-consequence">
                → Signal fort de conversion : le produit est boosté dans les résultats. Combiné avec VIEW:product, il alimente les recommandations "Fréquemment consultés ensemble".
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot order" />
            <div className="timeline-content">
              <div className="timeline-event">
                <span className="timeline-badge">ORDER</span>
                Commande finalisée
              </div>
              <div className="timeline-consequence">
                → Boucle complète : les produits achetés ensemble alimentent les recommandations "Fréquemment achetés ensemble". Le chiffre d'affaires par requête permet d'optimiser la pertinence en fonction du revenu généré.
              </div>
            </div>
          </div>
        </div>

        <div className="timeline-summary">
          <div className="timeline-summary-item">
            <strong>6 types d'événements</strong> captés automatiquement
          </div>
          <div className="timeline-summary-item">
            <strong>Score de popularité</strong> recalculé en continu
          </div>
          <div className="timeline-summary-item">
            <strong>Recommandations</strong> enrichies à chaque session
          </div>
          <div className="timeline-summary-item">
            <strong>Pertinence</strong> optimisée par le comportement réel
          </div>
        </div>
      </div>

      {/* Sequenced reveal */}
      <div className="closing-cards">
        {/* Stage 0: Delay — always visible */}
        <div className="closing-card">
          <h3>⏱ Délai de mise en place</h3>
          <div className="closing-compare">
            <div className="closing-compare-col market">
              <div className="closing-compare-label">Le marché</div>
              <div className="closing-compare-value">6 à 12 mois</div>
            </div>
            <div className="closing-compare-vs">vs</div>
            <div className="closing-compare-col gally">
              <div className="closing-compare-label">Gally</div>
              <div className="closing-compare-value">Quelques jours</div>
            </div>
          </div>
          {revealStage === 0 && (
            <button className="btn btn-primary closing-reveal-btn" onClick={() => setRevealStage(1)}>
              Et côté budget ? →
            </button>
          )}
        </div>

        {/* Stage 1: Cost */}
        {revealStage >= 1 && (
          <div className="closing-card reveal-in">
            <h3>💰 Coût la première année</h3>
            <div className="closing-compare">
              <div className="closing-compare-col market">
                <div className="closing-compare-label">Le marché</div>
                <div className="closing-compare-value">80 000 — 100 000 €</div>
              </div>
              <div className="closing-compare-vs">vs</div>
              <div className="closing-compare-col gally">
                <div className="closing-compare-label">Gally</div>
                <div className="closing-compare-value">À partir de ~12 000 €</div>
                <div className="closing-compare-note">Forfait flat, non indexé sur le catalogue ou les requêtes</div>
              </div>
            </div>
            {revealStage === 1 && (
              <button className="btn btn-primary closing-reveal-btn" onClick={() => setRevealStage(2)}>
                Voir nos plans →
              </button>
            )}
          </div>
        )}

        {/* Stage 2: Pricing */}
        {revealStage >= 2 && (
          <div className="closing-card reveal-in">
            <h3>📋 Nos offres</h3>
            <div className="pricing-cards">
              <div className="pricing-card featured">
                <div className="pricing-badge">Populaire</div>
                <h4>Business</h4>
                <div className="pricing-price">999 €<span>/mois</span></div>
                <ul className="pricing-features">
                  <li>Recherche intelligente</li>
                  <li>Facettes avancées</li>
                  <li>Recherche vectorielle</li>
                  <li>Merchandising visuel</li>
                  <li>Recommandations</li>
                  <li>Support prioritaire</li>
                </ul>
                <button className="btn btn-coral" style={{ width: '100%' }}>
                  Parler à un commercial
                </button>
              </div>
              <div className="pricing-card">
                <h4>Enterprise</h4>
                <div className="pricing-price">Sur devis</div>
                <ul className="pricing-features">
                  <li>Tout Business +</li>
                  <li>Multi-store illimité</li>
                  <li>SLA dédié</li>
                  <li>Intégration sur-mesure</li>
                  <li>Account manager</li>
                </ul>
                <button className="btn btn-outline" style={{ width: '100%' }}>
                  Parler à un commercial
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="closing-disclaimer">
        Ordres de grandeur observés sur des projets de search e-commerce comparables — hors coûts internes.
        À affiner selon le contexte du prospect.
      </p>
    </div>
  );
}
