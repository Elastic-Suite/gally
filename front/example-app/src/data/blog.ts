import { resolveProductImage } from './normalize'
import type {
  ArticleFilters,
  BlogArticle,
  BlogSection,
  Facet,
  Locale,
} from './types'

const BLOG_FR: BlogSection[] = [
  {
    slug: 'guides-style',
    title: 'Guides style',
    articles: [
      {
        slug: 'bien-choisir-son-gilet',
        section: 'Guides style',
        title: 'Bien choisir son gilet pour la mi-saison',
        excerpt:
          "Cardigan ajusté ou gilet oversize : comment trouver la maille qui s'accorde à toutes vos tenues.",
        body: [
          'La mi-saison est le terrain de jeu idéal pour les gilets et cardigans : assez chauds pour les matinées fraîches, assez légers pour ne pas alourdir une tenue de journée.',
          'Le Carina Cardigan se distingue par sa coupe near-ajustée et son devant ouvert, parfait à superposer sur un chemisier fin. Pour une allure plus décontractée, le Sabina Hooded Cardigan apporte une touche sportswear grâce à sa capuche.',
          'Côté matières, privilégiez le coton biologique ou la viscose pour les journées encore douces, et gardez la laine pour les premiers frimas.',
        ],
        heroImage: resolveProductImage('/v/s/vsw01-rn_main.jpg'),
        relatedCategoryIds: ['cat_10'],
        relatedSkus: ['VSW01', 'VSW06'],
      },
      {
        slug: 'associer-bijoux-dores-argentes',
        section: 'Guides style',
        title:
          'Bijoux dorés ou argentés : comment les associer sans se tromper',
        excerpt:
          'Nos règles simples pour mixer or et argent sans fausse note, du quotidien aux occasions.',
        body: [
          "Mélanger l'or et l'argent n'est plus tabou, à condition de garder un fil conducteur : une pièce dominante et des touches secondaires.",
          'Le Gold Omni Bangle Set se porte très bien seul, en empilement de bracelets sur un poignet. Pour les oreilles, alternez Silver Sol Earrings et Gold Sol Earrings selon la tenue du jour plutôt que de tout porter en même temps.',
          'Une astuce de styliste : accordez la teinte du bijou à la boucle de ceinture ou aux boutons du vêtement pour une allure cohérente.',
        ],
        heroImage: resolveProductImage('/v/a/va19-go_main.jpg'),
        relatedCategoryIds: ['cat_5'],
        relatedSkus: ['VA19-GO-NA', 'VA16-GO-NA', 'VA15-SI-NA'],
      },
      {
        slug: 'jupe-mi-longue-toutes-silhouettes',
        section: 'Guides style',
        title: 'La jupe mi-longue, une pièce qui va à toutes les silhouettes',
        excerpt:
          'Pourquoi la jupe midi est le vêtement le plus polyvalent de votre dressing cette saison.',
        body: [
          'Ni trop courte, ni trop longue, la jupe mi-longue structure la silhouette tout en restant confortable au quotidien.',
          "La Bellona Skirt, taille haute et coupe fluide, se porte aussi bien avec un pull qu'avec un chemisier rentré. Pour un look plus estival, la Tatiana Skirt fait partie de notre collection Carefree Days.",
          'Astuce : jouez sur les matières (popeline, crochet, denim) pour faire évoluer la même coupe du bureau au week-end.',
        ],
        heroImage: resolveProductImage('/v/s/vsk01-la_main.jpg'),
        relatedCategoryIds: ['cat_13'],
        relatedSkus: ['VSK01', 'VSK08'],
      },
    ],
  },
  {
    slug: 'actualites-mode',
    title: 'Actualités mode',
    articles: [
      {
        slug: 'shop-the-look-perfectly-beachy',
        section: 'Actualités mode',
        title: 'La collection "Perfectly Beachy" débarque',
        excerpt:
          'Matières fluides et teintes sable : notre nouvelle sélection pensée pour les journées ensoleillées.',
        body: [
          "Notre équipe styling a composé une collection capsule autour d'une même envie : la légèreté. Pantalons larges, mailles fines et accessoires se répondent dans une palette sable et kaki.",
          'On y retrouve la Clara Wide Leg Pants associée au Hanna Sweater pour un total look prêt à enfiler, du brunch à la plage.',
        ],
        heroImage: resolveProductImage('/v/p/vp04-sa_main.jpg'),
        relatedCategoryIds: ['cat_19'],
        relatedSkus: ['VP04', 'VSW05'],
      },
      {
        slug: 'nouveautes-de-la-saison',
        section: 'Actualités mode',
        title: 'Les nouveautés qui viennent d’arriver',
        excerpt:
          'Un aperçu des dernières pièces ajoutées au catalogue, à ne pas manquer.',
        body: [
          "Chaque semaine, de nouvelles pièces rejoignent notre catalogue. Cette fois-ci, on retient particulièrement les nouvelles coupes de robes maxi et les compléments d'accessoires en édition limitée.",
          'Direction la catégorie Nouveautés pour tout découvrir avant les autres.',
        ],
        heroImage: resolveProductImage('/v/d/vd04-fl_main.jpg'),
        relatedCategoryIds: ['cat_7'],
        relatedSkus: ['VD04'],
      },
    ],
  },
]

const BLOG_EN: BlogSection[] = [
  {
    slug: 'style-guides',
    title: 'Style guides',
    articles: [
      {
        slug: 'bien-choisir-son-gilet',
        section: 'Style guides',
        title: 'How to pick the right cardigan for in-between seasons',
        excerpt:
          'Fitted cardigan or oversized knit: finding the layer that works with every outfit.',
        body: [
          'Between-season weather is the perfect excuse for cardigans and sweaters: warm enough for cool mornings, light enough to not weigh a daytime outfit down.',
          'The Carina Cardigan stands out with its near-fitted cut and open front, perfect layered over a light blouse. For a more casual look, the Sabina Hooded Cardigan adds a sportswear touch thanks to its hood.',
          'For fabrics, favor organic cotton or viscose while the weather is still mild, and save wool for the first cold snaps.',
        ],
        heroImage: resolveProductImage('/v/s/vsw01-rn_main.jpg'),
        relatedCategoryIds: ['cat_10'],
        relatedSkus: ['VSW01', 'VSW06'],
      },
      {
        slug: 'associer-bijoux-dores-argentes',
        section: 'Style guides',
        title: 'Gold or silver jewelry: how to mix them without a misstep',
        excerpt:
          'Our simple rules for mixing gold and silver, from everyday looks to special occasions.',
        body: [
          "Mixing gold and silver isn't taboo anymore, as long as you keep one clear thread: one dominant piece and secondary accents.",
          'The Gold Omni Bangle Set looks great worn alone, stacked on one wrist. For earrings, alternate Silver Sol Earrings and Gold Sol Earrings depending on the outfit rather than wearing both at once.',
          "A stylist's tip: match the tone of the jewelry to the belt buckle or garment buttons for a cohesive look.",
        ],
        heroImage: resolveProductImage('/v/a/va19-go_main.jpg'),
        relatedCategoryIds: ['cat_5'],
        relatedSkus: ['VA19-GO-NA', 'VA16-GO-NA', 'VA15-SI-NA'],
      },
      {
        slug: 'jupe-mi-longue-toutes-silhouettes',
        section: 'Style guides',
        title: 'The midi skirt, a piece that flatters every silhouette',
        excerpt:
          'Why the midi skirt is the most versatile piece in your wardrobe this season.',
        body: [
          'Neither too short nor too long, the midi skirt shapes the silhouette while staying comfortable day to day.',
          'The Bellona Skirt, high-waisted with a fluid cut, pairs as well with a sweater as with a tucked-in blouse. For a more summery look, the Tatiana Skirt is part of our Carefree Days collection.',
          'Tip: play with fabrics (poplin, crochet, denim) to take the same cut from the office to the weekend.',
        ],
        heroImage: resolveProductImage('/v/s/vsk01-la_main.jpg'),
        relatedCategoryIds: ['cat_13'],
        relatedSkus: ['VSK01', 'VSK08'],
      },
    ],
  },
  {
    slug: 'fashion-news',
    title: 'Fashion news',
    articles: [
      {
        slug: 'shop-the-look-perfectly-beachy',
        section: 'Fashion news',
        title: 'The "Perfectly Beachy" collection has landed',
        excerpt:
          'Fluid fabrics and sandy tones: our new edit made for sunny days.',
        body: [
          'Our styling team put together a capsule collection around a single idea: lightness. Wide-leg pants, fine knits and accessories echo each other in a sand and khaki palette.',
          'You’ll find the Clara Wide Leg Pants paired with the Hanna Sweater for a ready-to-wear total look, from brunch to the beach.',
        ],
        heroImage: resolveProductImage('/v/p/vp04-sa_main.jpg'),
        relatedCategoryIds: ['cat_19'],
        relatedSkus: ['VP04', 'VSW05'],
      },
      {
        slug: 'nouveautes-de-la-saison',
        section: 'Fashion news',
        title: 'The new arrivals this week',
        excerpt:
          'A look at the latest pieces added to the catalog, not to be missed.',
        body: [
          'Every week, new pieces join our catalog. This time, we especially love the new maxi dress cuts and the limited-edition accessories.',
          'Head to the New Products category to discover them all first.',
        ],
        heroImage: resolveProductImage('/v/d/vd04-fl_main.jpg'),
        relatedCategoryIds: ['cat_7'],
        relatedSkus: ['VD04'],
      },
    ],
  },
]

export function getBlog(locale: Locale): BlogSection[] {
  return locale === 'fr' ? BLOG_FR : BLOG_EN
}

export function searchArticles(locale: Locale, query: string): BlogArticle[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return getBlog(locale)
    .flatMap((section) => section.articles)
    .filter(
      (article) =>
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.body.some((paragraph) => paragraph.toLowerCase().includes(q)),
    )
}

export function emptyArticleFilters(): ArticleFilters {
  return { sections: [], categoryIds: [] }
}

export function hasActiveArticleFilters(filters: ArticleFilters): boolean {
  return filters.sections.length > 0 || filters.categoryIds.length > 0
}

function matchesArticleFilters(
  article: BlogArticle,
  filters: ArticleFilters,
  exclude?: keyof ArticleFilters,
): boolean {
  if (
    exclude !== 'sections' &&
    filters.sections.length &&
    !filters.sections.includes(article.section)
  ) {
    return false
  }
  if (
    exclude !== 'categoryIds' &&
    filters.categoryIds.length &&
    !article.relatedCategoryIds.some((id) => filters.categoryIds.includes(id))
  ) {
    return false
  }
  return true
}

export function applyArticleFilters(
  articles: BlogArticle[],
  filters: ArticleFilters,
): BlogArticle[] {
  return articles.filter((a) => matchesArticleFilters(a, filters))
}

/**
 * Builds the CMS search sidebar facets: a "Section" facet (the blog rubric)
 * and a "Category" facet (product categories the article relates to).
 * Mirrors computeFacets' sticky-count behaviour for products.
 */
export function computeArticleFacets(
  articles: BlogArticle[],
  filters: ArticleFilters,
  categoryOptions: { id: string; name: string }[],
): Facet[] {
  const facets: Facet[] = []

  const sectionCandidates = articles.filter((a) =>
    matchesArticleFilters(a, filters, 'sections'),
  )
  const sectionCounts = new Map<string, number>()
  for (const article of sectionCandidates) {
    sectionCounts.set(
      article.section,
      (sectionCounts.get(article.section) ?? 0) + 1,
    )
  }
  if (sectionCounts.size) {
    facets.push({
      field: 'sections',
      label: 'Section',
      type: 'checkbox',
      options: [...sectionCounts.entries()]
        .map(([value, count]) => ({ label: value, value, count }))
        .sort((a, b) => b.count - a.count),
    })
  }

  const categoryCandidates = articles.filter((a) =>
    matchesArticleFilters(a, filters, 'categoryIds'),
  )
  const categoryCounts = categoryOptions
    .map((opt) => ({
      label: opt.name,
      value: opt.id,
      count: categoryCandidates.filter((a) =>
        a.relatedCategoryIds.includes(opt.id),
      ).length,
    }))
    .filter((opt) => opt.count > 0)
  if (categoryCounts.length) {
    facets.push({
      field: 'categoryIds',
      label: 'Category',
      type: 'checkbox',
      options: categoryCounts,
    })
  }

  return facets
}
