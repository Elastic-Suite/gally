# Recommender Gally : co-occurrence et similarité par règles

## 1. Contexte et objectif

Gally dispose d'un bundle Recommender (`gally-premium/Recommender`) basé sur le rule engine :

- un recommender a un ou plusieurs **types** (codes libres : `default`, `upsell`, `crosssell`…), des localized catalogs, des dates de validité et une priorité ;
- une **source rule** détermine à quels produits sources il s'applique ;
- une **target rule** détermine quels produits recommander ;
- l'API GraphQL est `productRecommendations(recommendationType, localizedCatalog, productSkus[], productCount)`.

Les sections *Co-occurrence* et *Similarity* existent dans le formulaire, mais leurs champs ne sont ni persistés (ORM) ni utilisés par le `RecommenderManager`.

**Objectif** : ajouter un signal comportemental automatique (co-occurrence issue des sessions) et une similarité configurable par règles, à la place de la similarité « magique » (More Like This) d'ElasticSuite, que les clients jugent opaque.

## 2. Principes

| Brique | Nature | Qui décide |
|---|---|---|
| Co-occurrence | Automatique, triplets imposés | Le moteur (observation des sessions) |
| Similarité | Règles explicites (rule engine) | Le marchand |
| Filtres relatifs | Opérateurs « same as », « higher than »… | Le marchand |

Les types (upsell, cross-sell, related) ne sont pas codés : ils se différencient par les règles saisies.

## 3. Construction de la recommandation

Pour chaque SKU source, la liste est construite en deux blocs successifs :

1. **Bloc co-occurrence** : produits co-occurrents, filtrés par `targetRule` (« Filter products »), triés par score de co-occurrence.
2. **Bloc similarité** : produits conformes à `similarityRule`, qui remplissent uniquement les places restantes.

Le dédoublonnage et l'exclusion des SKU sources sont conservés (comportement actuel du manager).

**Fallback** : sans co-occurrence et sans règle de similarité, on renvoie une liste vide, et le bloc ne s'affiche pas côté front.

## 4. Co-occurrence

### 4.1 Triplets et valeurs par défaut

Les triplets sont stockés dans `gally_configuration`. Ils sont communs à tous les recommenders et ajustables par localized catalog.

| Événement source → cible | Boost | `size` | `min_doc_count` |
|---|---|---|---|
| Commande → Commande | 10 | 10 | 2 |
| Ajout panier → Ajout panier | 5 | 10 | 3 |
| Vue produit → Vue produit | 2 | 10 | 5 |

Paramètre global : `maxAge` = 90 jours.

Ces valeurs sont des points de départ, à calibrer sur un vrai catalogue. Elles s'écartent des valeurs par défaut d'ElasticSuite :

| Paramètre | ElasticSuite | Gally (départ) |
|---|---|---|
| `size` | 5 (non passé par `CoOccurrenceQuery`) | 10, pour garder des candidats après le filtre `targetRule` |
| `min_doc_count` | un seul réglage global, 5 par défaut | un par triplet : 2 / 3 / 5 |
| `maxAge` | désactivé par défaut (tout l'historique) ; 100 jours si `limited_events_lookup` est activé | 90 jours, toujours actif |

**À revoir en fin de développement** : repasser sur ces valeurs (voir la section 11).

### 4.2 Calcul (logique reprise d'ElasticSuite, `CoOccurrence.php`)

On lance une requête sur l'index des sessions :

- filtre : sessions contenant la SKU source dans le champ de l'événement source ;
- filtre : `end_time > maintenant - maxAge` ;
- agrégation : `significant_terms` sur le champ de l'événement cible, avec `size` et `min_doc_count` propres au triplet ;
- pas de `background_filter`, comme dans ElasticSuite : l'arrière-plan est l'index des sessions entier, sans filtre d'âge. Un `background_filter` sur `maxAge` serait plus juste (on compare aujourd'hui 90 jours de premier plan à tout l'historique), mais ce n'est pas le comportement d'ElasticSuite ; il pourra être ajouté si les résultats le demandent.

La SKU source est ensuite exclue du résultat.

`min_doc_count` est le nombre minimum de sessions où un produit doit apparaître avec la source pour être retenu. C'est un filtre anti-bruit : bas pour les commandes (événements rares), plus haut pour les vues (événements nombreux).

#### Pourquoi `significant_terms` plutôt que `terms`

Un `terms` renvoie les produits les plus fréquents dans les sessions de la source, donc surtout les best-sellers. `significant_terms` renvoie les produits **anormalement fréquents** dans ces sessions, comparé à l'ensemble des sessions.

Exemple : 1 000 sessions, `VELO-01` commandé dans 20 d'entre elles.

| Produit | Premier plan (20 sessions avec VELO-01) | Arrière-plan (1 000 sessions) | Sur-représentation (premier plan / arrière-plan) |
|---|---|---|---|
| VELO-01 | 20/20 = 100 % | 20/1000 = 2 % | × 50 (source, exclue) |
| ANTIVOL | 5/20 = 25 % | 12/1000 = 1,2 % | × 20,8 |
| CASQUE | 8/20 = 40 % | 30/1000 = 3 % | × 13,3 |
| SAC-CABAS | 15/20 = 75 % | 700/1000 = 70 % | × 1,07 |
| CHAUSSETTES | 2/20 = 10 % | 100/1000 = 10 % | × 1 (aucune) |

Un `terms` aurait classé SAC-CABAS en premier, alors qu'il est présent dans 70 % de toutes les commandes : `significant_terms` le relègue en fin de liste.

**Algorithme de score : GND**, comme ElasticSuite. C'est la valeur par défaut du `SignificantTerm` d'ElasticSuite, que `CoOccurrence.php` ne change pas, et du `SignificantTerms` porté dans Gally. GND (Google Normalized Distance) mesure à quel point un produit et la source apparaissent ensemble plutôt que séparément. Ses valeurs diffèrent du rapport ci-dessus, mais le principe est le même : un produit présent partout (SAC-CABAS) n'est pas significatif.

#### Requête (les trois triplets en un seul aller-retour)

Chaque triplet a son propre premier plan, porté par une agrégation `filter`. Le `significant_terms` imbriqué l'utilise comme premier plan.

```json
POST <tracking_session>/_search
{
  "size": 0,
  "query": { "range": { "end_time": { "gte": "now-90d" } } },
  "aggs": {
    "order": {
      "filter": { "term": { "product_order": "VELO-01" } },
      "aggs": { "co": { "significant_terms": {
        "field": "product_order", "size": 10, "min_doc_count": 2, "gnd": {}
      } } }
    },
    "cart": {
      "filter": { "term": { "product_cart": "VELO-01" } },
      "aggs": { "co": { "significant_terms": {
        "field": "product_cart", "size": 10, "min_doc_count": 3, "gnd": {}
      } } }
    },
    "view": {
      "filter": { "term": { "product_view": "VELO-01" } },
      "aggs": { "co": { "significant_terms": {
        "field": "product_view", "size": 10, "min_doc_count": 5, "gnd": {}
      } } }
    }
  }
}
```

Chaque bucket renvoie `key` (la SKU), `doc_count` (sessions au premier plan), `bg_count` (sessions à l'arrière-plan) et `score`. Ces comptages ne sont justes que si un document de session compte pour 1 (voir la section 9.2 sur `_doc_count`).

### 4.3 Injection dans la requête catalogue

Reprise du `Matcher` et du `SearchQueryBuilder` d'ElasticSuite (requête des produits liés) :

- Chaque triplet devient une clause `should` : un `terms` sur `sku.untouched` avec le boost du triplet. Une requête `terms` a déjà un score constant égal à son boost : pas besoin de `constant_score` (type absent de Gally).
- `minimum_should_match: 1`, comme ElasticSuite : seuls les produits co-occurrents sortent, filtrés par la `targetRule`.
- Les scores se cumulent : un produit commandé **et** vu avec la source vaut 12.
- La requête est **notée** et placée dans la requête principale, comme `addSearchFilter()` d'ElasticSuite (qui pose la requête de la collection, pas un filtre) : les `top_hits` du `RecommenderManager` héritent du `_score`.
- La source de la co-occurrence est le SKU en cours : le manager boucle déjà sur chaque SKU source, comme ElasticSuite fait une recherche par produit affiché.
- Sans aucune co-occurrence, pas de recherche pour ce SKU (comme `isPreventingZeroConstraintsRequests` d'ElasticSuite).

Conséquence (étape 3, conception stricte validée) : un recommender ne renvoie plus les produits de sa `targetRule` sans donnée comportementale. Le bloc de complément arrive avec la `similarityRule` (étape 4).

## 5. Similarité par règles

- On utilise la section « Similarity » existante : `similarityRule` plus le boost optionnel (model `constant_score` / `attribute_value`).
- Elle forme le bloc de complément (voir la section 3).
- **Pas de More Like This** : la similarité est exclusivement déterministe.

### 5.1 Champs du recommender (validés le 2026-10-30, à partir de la maquette)

La maquette de formulaire (branche `feat-Recmmendation-mockup`) sert de référence, avec ses erreurs de brouillon corrigées (orthographe `co_occurrence`, libellés copiés d'autres entités, champs facultatifs non nullables, positions en double).

| Section | Champ | Défaut | Rôle |
|---|---|---|---|
| Co-occurrence | `enableCoOccurrence` | `false` (migration : `true` pour les recommenders existants) | active le bloc co-occurrence |
| Co-occurrence | `targetRule` (« Filter products ») | — | filtre les produits co-occurrents |
| Similarity | `enableSimilarity` | `false` | active le bloc similarité |
| Similarity | `similarityRule` | — | produits du bloc de complément |
| Similarity | boost optionnel : interrupteur, règle, modèle `constant_score` / `attribute_value`, valeur | désactivé | trie le bloc similarité, comme le bundle Boost (étape 4b) |

- `isActive` garde `true` par défaut.
- **Pas de boost propre à la co-occurrence** (présent dans la maquette) : l'ordre du bloc co-occurrence vient des boosts des triplets (section 4.1).

## 6. Opérateurs relatifs au produit source

### 6.1 Opérateurs du MVP

| Type d'attribut | Opérateurs | Valeur saisie |
|---|---|---|
| Catégorie | same as, not same as | aucune |
| Select / multiselect, keyword | same as, not same as | aucune |
| Booléen | same as, not same as | aucune |
| Prix | higher than, lower than | % optionnel |
| Int / float | higher than, lower than | % optionnel |
| Texte | aucun | — |

Ces opérateurs ne sont disponibles **que dans le contexte recommender**, pas dans les catégories virtuelles ni dans les boosts.

### 6.2 Sémantique

- **Multivalué** : `same as` = au moins une valeur en commun.
- **Catégories** : on exclut la catégorie racine et les catégories virtuelles (souvent des catégories marketing transverses).
- **Prix** : on compare le prix du price group courant (`SearchContext`), côté source et côté candidat.
- **Pourcentage** : `higher than` seul = strictement supérieur, sans limite. `higher than +X %` = supérieur, et au plus X % au-dessus. Pour exprimer un « prix proche », on combine `higher than -X %` ET `lower than +Y %`. *À préciser : l'acceptation d'un pourcentage négatif.*
- **Multi-SKU (panier)** : la résolution se fait SKU par SKU.

### 6.3 Points techniques

- **Résolution des valeurs source** : récupérer le `_source` du produit dans la requête déjà faite par `getApplicableRecommenders`, puis le passer via `$filterContext` à `RuleEngineManager::transformRuleToGallyFilters`.
- **Cache des règles** : la clé actuelle est construite sur la règle et le localized catalog. Pour une règle relative, il faut soit inclure les valeurs résolues dans la clé, soit cacher la règle avant résolution. Sinon le cache est empoisonné par le premier produit source.
- **UI admin** : gérer les opérateurs sans valeur et ceux avec un pourcentage optionnel.

## 7. Configurations types (documentation, pas de presets)

Il n'y a pas de pré-remplissage automatique dans le MVP. La documentation marchand recommande :

| Usage | `targetRule` et `similarityRule` |
|---|---|
| Substitution (upsell) | `category same as` + `price higher than (+X %)` |
| Complémentarité (cross-sell / related) | `category not same as` |

Rappel : un recommender sans règle de similarité ne s'affiche que s'il y a de la co-occurrence (voir le fallback de la section 3).

## 8. Prévisualisation en BO (MVP minimal)

Dans le formulaire du recommender, le marchand saisit une SKU source et voit la liste des produits recommandés, chacun avec un badge « co-occurrence » ou « règle ».

En phase 2, on ajoutera le détail (triplet, score).

## 9. Index des sessions

On ajoute des champs **keyword multivalués aplatis** à côté de la structure existante `views` / `cart` / `order`, qui est conservée pour ses consommateurs actuels (SearchUsage, KPI) : `product_view`, `product_cart`, `product_order`.

Ces champs contiennent la **SKU** (identifiant de rapprochement avec le catalogue).

### 9.1 Constats (vérifiés le 2026-10-28)

**`views` / `cart` / `order` sont mappés en `nested`.**

- Les source fields sont déclarés avec des codes pointés (`views.items`, `views.count`, `views.metadata_code`…) dans la migration `Version20260910120500_Add_Tracker_Session_Source_Field`. Or `SourceField::isNested()` considère comme nested tout code contenant un point, avec le premier segment comme chemin.
- C'est confirmé sur le cluster local : `"views": {"type": "nested", "properties": {"count": long, "items": keyword, "metadata_code": keyword}}`, idem pour `cart` et `order`.
- Une session contient un sous-document par `metadata_code` (produit et catégorie mélangés dans `views`).
- Conséquence : un `significant_terms` sur `views.items` devrait passer par une agrégation `nested`, avec des comptes de premier plan et de fond portant sur les sous-documents et non sur les sessions. Les champs aplatis sont donc **nécessaires**.

**Contrainte de nommage** : les codes des nouveaux champs ne doivent **pas contenir de point**, sinon Gally les mappe à leur tour en nested. `product_view`, `product_cart` et `product_order` donnent bien des keywords multivalués à la racine.

**`entity_code` contient la SKU** (fixtures `tracking_event_documents.json` de `gally-sample-data`, comparées aux `product_documents.json`) :

| Jeu | view | add_to_cart | order | Correspondance avec `id` |
|---|---|---|---|---|
| 00_toolbox | 364/364 | 270/270 | 270/270 | 0 |
| 01_fashion | 407/407 | 231/231 | 231/231 | 0 |
| 02_papershop | 645/645 | 147/147 | 66/66 | 0 |
| default | 42/52 | 21/27 | 6/7 | 0 |

- `entity_code` est toujours une SKU, jamais l'ID interne. L'exemple `Tracker/Example/GraphQl/2_product_view.graphql` utilise aussi une SKU.
- Les écarts du jeu `default` (`VD15`, `VD20`, `VD22`, `VJ06`, `VP14`, `VP16`, `VT15`) sont des produits absents du catalogue de ce jeu : incohérence des fixtures, pas un problème d'identifiant.
- Pour les événements de catégorie, `entity_code` contient le code catégorie (`cat_fio_20`).

**`child_sku`** : les événements `add_to_cart` et `order` acceptent un `child_sku` dans le payload (`EventAddToCartValidator`, `EventOrderValidator`). La convention implicite est : `entity_code` = SKU du produit catalogue (parent), `child_sku` = variante. Le transform alimente `items` avec `entity_code`, donc la co-occurrence se fait au niveau parent, cohérent avec les documents produit. Dans les fixtures, les deux valeurs sont identiques (produits simples) : le cas configurable n'est pas couvert.

### 9.2 `_doc_count` : une session ne compte pas pour 1 (corrigé à l'étape 1)

**Constat.** Le transform OpenSearch écrit dans chaque document de session un champ `_doc_count` égal au nombre d'événements de la session. Aucun code Gally ne l'ajoute : c'est le comportement natif du transform. Pour OpenSearch, ce champ spécial signifie « ce document en représente N » : **toutes les agrégations par bucket** comptent le document N fois, alors que `hits.total` le compte une fois.

Vérifié sur `fashion_fr` après reset : un filtre sur une SKU commandée renvoie 1 session, mais chaque bucket d'un `terms` affiche `doc_count = 14`.

Exemple :

| Session | `product_order` | `_doc_count` |
|---|---|---|
| A | SKU1, SKU2, SKU3 | 14 |
| B | SKU1, SKU4 | 3 |

Filtre `product_order = SKU1` (2 sessions) puis `terms` sur `product_order` :

| Produit | Attendu (sessions) | Renvoyé (avec `_doc_count`) |
|---|---|---|
| SKU1 | 2 | 17 |
| SKU2 | 1 | 14 |
| SKU4 | 1 | 3 |

**Conséquences.**

- `significant_terms` plante : `subsetFreq > subsetSize, in JLHScore`. Le compte d'un produit (gonflé par `_doc_count`) dépasse le nombre de sessions du premier plan (compté en documents réels).
- `min_doc_count` compterait des événements et non des sessions : une seule session très active passerait n'importe quel seuil.
- Les KPI de SearchUsage ne sont pas touchés : ils comptent les sessions avec un `cardinality` sur `session_uid`, pas avec le `doc_count`. Ce contournement n'est pas possible avec `significant_terms`, dont le score repose sur le `doc_count`.

**Correction retenue : une agrégation `_doc_count` dans le transform.** Le transform construit chaque document en deux temps : il pose d'abord ses propres champs (`_doc_count` et `transform._doc_count`), puis un champ par agrégation, au nom de l'agrégation. Une agrégation nommée `_doc_count` qui renvoie toujours 1 écrase donc la valeur posée par le transform :

```php
'_doc_count' => [
    'scripted_metric' => [
        'init_script' => 'state.value = 1;',
        'map_script' => 'state.value = 1;', // un map_script vide fait échouer la recherche du transform
        'combine_script' => 'return 1;',
        'reduce_script' => 'return 1;',
    ],
],
```

Chaque session pèse alors 1 dans les agrégations par bucket. Le champ `transform._doc_count`, un `long` ordinaire sans effet sur les comptages, garde le nombre d'événements de la session.

Validé le 2026-10-29 par un vrai transform sur des index jetables (OpenSearch 2.16) : sessions A (5 événements) et B (3 événements) ayant toutes deux vu SKU1 → documents avec `_doc_count: 1`, `terms` SKU1 = 2 (8 sans correction), `significant_terms` s'exécute sans erreur.

**Limite.** Ce comportement (ordre d'écriture des champs) n'est pas documenté par OpenSearch. Le test `SessionTransformProvisionerTest::testSessionDocumentsWeighOneInBucketAggregations` le vérifie via l'API `_preview` des transforms, qui construit les documents de la même façon : il échouera si une montée de version d'OpenSearch change ce comportement.

**Alternative écartée : un pipeline d'ingestion.** Un pipeline par défaut (`index.default_pipeline`) avec un processeur `remove` sur `_doc_count` fonctionne aussi (validé : les écritures du transform passent par le pipeline). Il repose sur des mécanismes documentés, mais demande de créer le pipeline et de le déclarer aux deux endroits qui créent l'index des sessions (`SessionTransformProvisioner` et `SessionIndexRolloverManager`). C'est la solution de repli si l'agrégation cesse de fonctionner.

### 9.3 Reste à vérifier

- Ce que les connecteurs réels envoient dans `entityCode` pour un produit configurable (parent ou variante). Aucun code d'envoi d'événements trouvé dans `connectors/gally`, `gally-sylius-connector` ni `gally-ts-sdk`.

## 10. Performance

- Les agrégations des trois triplets sont regroupées en une requête multi-agrégations, ou en `_msearch`.
- Les co-occurrences sont mises en cache en mémoire le temps de la requête HTTP, comme dans ElasticSuite. Pas de cache persistant (composant `Cache` de Gally) pour l'instant : les recommandations restent à jour avec les sessions, sans invalidation à gérer. À ajouter seulement si les performances le demandent.
- `maxAge` limite le volume de sessions parcourues.

## 11. Points restant à préciser (non bloquants)

- Où vit la liste d'exclusion des catégories (globale, par localized catalog ou par recommender).
- L'acceptation d'un pourcentage négatif sur `higher than` / `lower than`.
- **TODO fin de développement** : repasser sur les valeurs de co-occurrence (`size`, `min_doc_count`, `maxAge`, boosts) et comparer aux valeurs d'ElasticSuite (section 4.1).

## 12. Hors périmètre MVP (phase 2)

- Triplets configurables par recommender (migration vers un JSON ou une entité enfant).
- Presets de règles à la création d'un recommender.
- Détail des scores dans la prévisualisation.
- Signaux `view → search_query` et `view → category_view`.
- Co-occurrence à deux sauts (via les produits similaires).
- Pondération par le score `significant_terms`.
- Exclusion des produits déjà achetés (demande `session_vid` dans l'API).
- Répartition équilibrée par article du panier pour le cross-sell.
- Recommandations personnalisées par visiteur.

## Annexe : ce qui est repris d'ElasticSuite

| Élément ES | Devenir dans Gally |
|---|---|
| `CoOccurrence` (`significant_terms` sur les sessions) | Repris (logique) |
| Filtre de session « contient le produit source » (`getSessionFilter`) | Repris, sur les champs `product_*` ; la source peut être une liste de SKU (terms), comme dans `SimilarProductCoOccurrenceQuery` |
| Filtre d'âge sur la fin de session | Repris, sur `end_time` |
| Arrière-plan = index entier (pas de `background_filter`) | Repris |
| Score `significant_terms` ignoré, seule la liste compte | Repris (pondération par le score en phase 2) |
| Exclusion du produit source (`array_diff`) | Repris |
| Erreur OpenSearch → liste vide (`catch`) | Repris, avec un log |
| Cache en mémoire par jeu d'arguments, le temps de la requête | Repris tel quel |
| Algorithme de score GND (défaut de `SignificantTerm`) | Repris (même défaut dans le `SignificantTerms` de Gally) |
| Bucket `__other_docs` ignoré | Repris |
| Triplets `orderRelated` (10) / `addToCartRelated` (5) | Repris, avec en plus `view → view` (2) ; une requête multi-agrégations au lieu d'une requête par triplet |
| `min_doc_count`, `maxAge` (`CoOccurrencePlugin`), `size` | Repris en configuration, par triplet, avec d'autres valeurs de départ (section 4.1) |
| Identifiants produit (`entity_id`) | Remplacés par la SKU |
| Co-occurrents utilisés comme « like » d'un More Like This (`includeOriginalDocs`) | Remplacé par un `terms` sur la SKU : seuls les produits co-occurrents sont renvoyés |
| Co-occurrence à deux sauts (`orderSimilarRelated`, `addToCartSimilarRelated`) | Phase 2 |
| Restriction aux événements de l'entreprise (B2B, `restrict_to_company`) | Non repris : pas de B2B dans Gally |
| `Upsell\SearchQuery\Category`, `HigherPrice` | Remplacés par les opérateurs relatifs |
| `ManualProducts`, `ItemProvider` (liens manuels) | Remplacés par le rule engine |
| More Like This (similarité) | Remplacé par la similarité par règles |
| `behavior` (manuel / auto / mixte) | Remplacé par les deux blocs (co-occurrence puis règles) |
| Blocs, layout, AJAX, FPC | Non repris (spécifique Magento) |
