# Direction artistique — inspirée de elasticsuite.io

Ce document consigne les éléments de langage visuel extraits directement du CSS/HTML compilé de [elasticsuite.io](https://elasticsuite.io/) (thème WordPress + Tailwind v4), complétés par les captures d'écran de référence e-commerce du dossier `da/`. Objectif : servir de base de design system pour la réécriture from-scratch de `front/example-app`.

> Source technique : `app-BKnBIAbv.css` (bundle Tailwind compilé du site), inspecté le 2026-07-22. Les valeurs ci-dessous sont les vraies valeurs de production, pas des approximations visuelles.

---

## 1. Palette de couleurs

Le site définit sa palette en **OKLCH** (perceptuellement uniforme). À reproduire telle quelle si la stack cible supporte `oklch()` (tous navigateurs modernes), sinon utiliser les équivalents hex indiqués entre parenthèses quand ils ont pu être extraits directement du CSS.

### Bleu "Indigo" (couleur froide dominante, fonds sombres / héros)

| Token | OKLCH | Usage |
|---|---|---|
| `--color-indigo-dark` | `oklch(23.33% .1068 282.4)` | Fond header/nav en mode dark |
| `--color-indigo-deep` | `oklch(29.44% .1709 272.7)` | Fond terminal / blocs sombres |
| `--color-elastic-blue` | `oklch(37.92% .2268 271.95)` (≈ `#4A3BDD`) | Couleur de marque bleue, extrémité des gradients |
| `--color-indigo-mid` | `oklch(48.43% .2327 277.35)` | Toggle "on" (thumb) |
| `--color-indigo-light` | `oklch(72.21% .1319 285.57)` (≈ `#9E98F4`) | Texte sur fond sombre, toggle "on" (piste) |
| `--color-indigo-tint` | `oklch(94.68% .0268 288.17)` | Piste de toggle "off" |

### Corail / Orange (couleur chaude dominante, CTA)

| Token | OKLCH | Usage |
|---|---|---|
| `--color-coral-deep` | `oklch(58.91% .1491 27.06)` | Hover profond |
| `--color-elastic-coral` | `oklch(69.72% .1524 28.78)` (≈ `#ED7465`) | **Couleur CTA principale** (boutons, liens actifs) |
| `--color-coral-mid` | `oklch(76.21% .1169 27.83)` | Active/pressed state |
| `--color-coral-light` | `oklch(88.34% .0531 26.85)` | Fond de progress bar, hover secondaire |
| `--color-coral-tint` | `oklch(97.08% .0143 28.01)` | Fond très clair (badges) |

### Neutres (gris bleuté, jamais gris pur)

| Token | OKLCH | Usage |
|---|---|---|
| `--color-neutral-50` | `oklch(99.11% 0 0)` | Blanc quasi-pur (surfaces, texte sur fond sombre) |
| `--color-neutral-100` → `-500` | dégradé clair | Fonds de cartes, bordures discrètes |
| `--color-neutral-600` → `-900` | dégradé foncé | Texte principal, fonds sombres alternatifs |
| `--color-white` | `oklch(100% 0 0)` | Blanc absolu |

**Règle de composition** : le site n'utilise jamais de noir/blanc/gris neutres au sens strict — tout est teinté légèrement bleu (`neutral-*`) ou dérivé indigo/corail. C'est ce qui donne la cohérence "froid + accent chaud".

---

## 2. Typographie

- **Police** : [Geist](https://vercel.com/font) (sans-serif), variante mono `Geist Mono` pour le code. Poids chargés : 400, 500, 600, 700.
- Fallback stack : `"Geist","Helvetica Neue","Helvetica","Arial",sans-serif`

Échelle typographique (`es-typo-*`) :

| Classe | Taille | Poids | Line-height |
|---|---|---|---|
| `xs` | 12px | 400 | 18px |
| `sm` | 13px | 500 | 24px |
| `base` | 15px | 400 | 24px |
| `md` | 19px | 400 | 28px |
| `lg` | 24px | 500 | 32px |
| `xl` | 30px | 600 | 30px |
| `2xl` | 38px | 700 | 38px |
| `3xl` | 48px | 700 | 60px |
| `4xl` | 60px | 700 | 72px |
| `5xl` | 72px | 700 | 84px |

---

## 3. Espacements & rayons

Le site a son propre système d'espacement/radius (`--es-*`), distinct de l'échelle Tailwind par défaut :

```css
--es-spacing-none: 0px;
--es-spacing-xxs: 4px;
--es-spacing-xs: 8px;
--es-spacing-sm: 16px;
--es-spacing-md: 24px;
--es-spacing-lg: 32px;
--es-spacing-xl: 46px;
--es-spacing-2xl: 64px;
--es-spacing-3xl: 96px;
--es-spacing-4xl: 128px;

--es-radius-none: 0px;
--es-radius-sm: 4px;
--es-radius-md: 8px;
--es-radius-lg: 12px;
--es-radius-xl: 16px;
--es-radius-2xl: 24px;
--es-radius-full: calc(infinity * 1px); /* pill parfait */
```

**Signature visuelle forte : tout est très arrondi.** Cartes en `radius-xl`/`radius-2xl`, boutons et barres de recherche en `radius-full` (pilule complète). Quasiment aucun angle droit visible sur les composants interactifs.

---

## 4. Glassmorphism

Le glassmorphism est utilisé sur les panneaux flottants au-dessus des visuels héros (cf. captures `da/` : la carte "Discover Our Top Swimwear" posée sur la photo, ou la barre de recherche flottante sur fond photo).

Recette exacte relevée dans le CSS :

```css
.glass-panel {
  background-color: color-mix(in oklch, var(--color-neutral-50) 50%, transparent); /* bg-neutral-50/50 */
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border-radius: var(--es-radius-xl); /* 16px */
  padding: var(--es-spacing-sm);
}

/* Variante plus subtile, utilisée sur fond sombre */
.glass-panel--subtle {
  background-color: color-mix(in oklch, var(--color-neutral-50) 10%, transparent); /* bg-neutral-50/10 */
  backdrop-filter: blur(4px); /* blur-xs */
  box-shadow: var(--es-hero-cockpit-shadow); /* 0px 0px 50px 0px oklch(0% 0 0 / .4) */
}
```

Échelle de blur disponible si besoin d'ajuster l'intensité :
`--blur-xs: 4px` · `--blur-sm: 8px` · `--blur-md: 12px` · `--blur-lg: 16px` · `--blur-xl: 24px` · `--blur-2xl: 40px` · `--blur-3xl: 64px`

Toujours associer le blur à une opacité de fond faible (10 à 50%) sur une surface `neutral-50` (jamais blanc pur), posée sur un visuel contrasté (photo ou fond sombre) — sinon l'effet verre ne se voit pas.

---

## 5. Boutons arrondis orange (CTA)

Pattern relevé sur tous les CTA primaires (`Add to Cart`, `Book a demo`, etc., cf. captures `da/`) :

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: var(--es-radius-full); /* pilule */
  padding: var(--es-spacing-xs) var(--es-spacing-md); /* 8px 24px */
  border: 2px solid transparent;
  background-color: var(--color-elastic-coral);
  color: var(--color-neutral-50);
  font: inherit; /* es-typo-sm en général : 13px/24px, 500 */
  cursor: pointer;
  transition: background-color 0.8s ease-in-out, color 0.8s ease-in-out, border-color 0.8s ease-in-out;
}
.btn-primary:hover        { background-color: var(--color-neutral-900); }
.btn-primary:focus-visible{ background-color: var(--color-neutral-900); border-color: var(--color-neutral-50); outline: 1px solid; }
.btn-primary:active       { background-color: var(--color-neutral-800); }
.btn-primary:disabled     { background-color: var(--color-neutral-300); color: var(--color-neutral-500); cursor: default; }
```

Point notable : le hover ne fonce **pas** le corail lui-même, il bascule vers un **quasi-noir bleuté** (`neutral-900`). C'est ce contraste chaud→sombre qui donne le côté premium au survol (visible aussi sur les captures `da/` : bouton "Add to cart" orange plein, coin arrondi complet).

Bouton secondaire (icône, flèches de slider) : même structure mais fond `coral-light`, hover `elastic-coral`, taille carrée `32×32px` en cercle parfait.

---

## 6. Bordures en gradient bleu-orange (l'effet signature)

C'est l'élément le plus caractéristique du site : un anneau de gradient conique **animé** (rotation continue) qui encadre les barres de recherche (visible aussi sur les captures `da/` : contour du champ de recherche qui passe du bleu à l'orange). Ce n'est **pas** une simple `border-image` — c'est une astuce à deux pseudo-éléments :

```css
:root {
  --gradient-ring: conic-gradient(
    from 0deg at 50% 50%,
    #ed7465 -19.62deg,
    #ed746500 61.57deg,
    #4a3bdd00 65deg,
    #4a3bdd00 99.02deg,
    #4a3bdd 137.01deg,
    #ed7465 340.38deg,
    #ed746500 421.57deg
  );
}

@keyframes rotating-gradient {
  to { transform: rotate(1turn); }
}

.gradient-ring {
  position: relative;
  z-index: 0;
  border-radius: 9999px;
  overflow: hidden;
}

/* pseudo-élément 1 : le gradient, plus grand que le conteneur, centré, qui tourne */
.gradient-ring::before {
  content: "";
  position: absolute;
  z-index: -2;
  top: 50%; left: 50%;
  width: 100%; aspect-ratio: 1;
  margin-top: -50%; margin-left: -50%;
  background-image: var(--gradient-ring);
  animation: rotating-gradient 3s linear infinite;
}

/* pseudo-élément 2 : masque le centre, ne laisse dépasser que 2px = l'anneau visible */
.gradient-ring::after {
  content: "";
  position: absolute;
  z-index: -1;
  top: 2px; left: 2px;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  border-radius: 9999px;
  background-color: var(--color-neutral-50); /* couleur de la surface intérieure */
}
```

Le conteneur qui porte `.gradient-ring` doit avoir un `padding` interne (`--es-spacing-sm` = 16px sur desktop) pour que le contenu (input, icônes) ne touche pas l'anneau. Épaisseur de l'anneau = 2px de chaque côté (modifiable en changeant `top/left` et le `calc`).

---

## 7. Toggles (switches)

Utilisé pour le toggle "AI Search" visible dans les captures `da/` (à droite de la barre de recherche).

```css
.toggle {
  appearance: none;
  position: relative;
  cursor: pointer;
  border-radius: 9999px;
  width: 48px; height: 24px;      /* variante "sm" */
  /* width: 64px; height: 32px;   variante "base" */
  background-color: var(--color-indigo-tint);
  transition: background-color 0.3s;
}
.toggle:checked { background-color: var(--color-indigo-light); }

.toggle::before {
  content: "";
  position: absolute;
  top: 2px; left: 2px;             /* 4px/4px pour la variante "base" */
  width: 20px; height: 20px;       /* 24px/24px pour la variante "base" */
  border-radius: 9999px;
  background-color: var(--color-indigo-light);
  transition: background-color 0.3s, translate 0.3s;
}
.toggle:checked::before {
  background-color: var(--color-indigo-mid);
  translate: 24px 0;               /* largeur piste - largeur thumb - 2*inset */
}
```

Palette du toggle toujours dans la famille **indigo** (jamais corail) — le corail est réservé aux actions/CTA, l'indigo aux réglages/états.

---

## 8. Formes géométriques animées (SVG)

Le site utilise un sprite SVG de formes abstraites (`<symbol id="shape__...">`) réutilisées comme décor flottant en arrière-plan des sections :

**Formes disponibles** : `asterisk`, `burger`, `circle`, `cog`, `crushed`, `cube`, `equal`, `flower` (+ variantes `flower-1/2/3`), `plan`, `rosette`, `square`, `star`, `wave`, `rotatingGradient`.

Chaque forme est :
- un `<svg viewBox="0 0 200 200">` avec `<use xlink:href="#shape__xxx">`
- coloriée en aplat avec une teinte de la palette (`fill-indigo-mid`, `fill-elastic-blue`, `fill-neutral-50`…), jamais en couleur "réaliste"
- positionnée en `absolute`, à moitié hors-cadre, avec une rotation statique légère (`rotate-15`, `-rotate-33`…)
- animée en **parallax au scroll** via GSAP ScrollTrigger, pas en boucle infinie : attributs `data-parallax`, `data-parallax-start="top bottom"`, `data-parallax-end="bottom top"`, `data-parallax-scrub`, `data-parallax-x-percent`, `data-parallax-y-percent`, `data-parallax-rotate`, `data-parallax-speed`. La forme translate/tourne progressivement pendant que l'utilisateur scrolle la section.

Exemple représentatif :

```html
<svg
  data-parallax
  data-parallax-start="top bottom"
  data-parallax-end="bottom top"
  data-parallax-scrub="1.5"
  data-parallax-rotate="30"
  data-parallax-speed="10"
  viewBox="0 0 200 200"
  class="absolute -rotate-15 fill-indigo-mid w-64"
>
  <use xlink:href="#shape__flower-2"></use>
</svg>
```

Complément : un halo radial flou est parfois posé derrière ces formes pour renforcer la profondeur :
```css
background: radial-gradient(50% 50% at 50% 50%, #9E98F4 0%, #4A3BDD 40%, rgba(74,59,221,0) 95%, transparent 100%);
```

**Pour la réécriture** : pas besoin de GSAP au premier jet — une version simplifiée en CSS pur (`@keyframes` + `animation-timeline: view()` ou simplement un flottement doux `translate`/`rotate` en boucle) donne déjà l'esprit "formes géométriques flottantes" sans la dépendance scroll-linked.

---

## 9. Ombres

```css
--shadow-sm: 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a;
--shadow-md: 0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a;
--shadow-lg: 0 10px 15px -3px #0000001a, 0 4px 6px -4px #0000001a;
--shadow-xl: 0 20px 25px -5px #0000001a, 0 8px 10px -6px #0000001a;
--es-hero-cockpit-shadow: 0px 0px 50px 0px oklch(0% 0 0 / .4); /* halo sombre sous les panneaux glass héros */
```

Toujours des ombres noires très diffuses et peu opaques (`#0000001a` ≈ 10% d'opacité) — jamais d'ombre dure ou colorée.

---

## 10. Enseignements des captures `da/` (références e-commerce)

- Cartes produit : image plein cadre en haut, coins arrondis (`radius-lg`/`xl`), nom du produit en indigo, prix en gris, CTA "Add to cart" en pilule corail pleine largeur ou inline.
- Widget de recherche flottant : toujours en pilule (`radius-full`), avec l'anneau gradient bleu→orange animé décrit en §6, posé en glassmorphism sur une photo.
- Toggle "AI Search" : accolé à droite de la barre de recherche, palette indigo (§7).
- Fonds de sections secondaires en dégradé indigo profond → violet clair, avec formes géométriques en transparence (§8) qui débordent du cadre.
- Tooltips/popovers (ex. "conversion rate 3,6%") : carte blanche flottante, coins arrondis, ombre `shadow-lg`, sans bordure visible — repose uniquement sur l'ombre pour se détacher.

---

## 11. Ce qu'il faut éviter (anti-patterns du site à ne pas casser)

- Ne pas utiliser de gris neutre pur (`#fff`/`#000`/`#ccc`) : toujours passer par les tokens `neutral-*` teintés bleu.
- Ne pas mélanger corail et indigo sur un même composant interactif : le corail est réservé aux actions (CTA, prix, focus fort), l'indigo aux éléments de contrôle/état (toggles, liens de navigation, texte secondaire sur fond sombre).
- Ne pas faire d'angles droits sur les éléments cliquables : le rayon minimum observé sur un bouton/input est `radius-md` (8px), la plupart sont en pilule complète.
- Ne pas poser de glassmorphism sur un fond uni sans contraste (image, dégradé ou fond sombre) : sans contraste sous-jacent le flou ne se voit pas.
