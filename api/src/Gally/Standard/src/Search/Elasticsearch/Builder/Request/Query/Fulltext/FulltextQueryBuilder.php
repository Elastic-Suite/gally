<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Search\Elasticsearch\Builder\Request\Query\Fulltext;

use Gally\Index\Model\Index\Mapping\FieldFilterInterface;
use Gally\Index\Model\Index\Mapping\FieldInterface;
use Gally\Index\Model\Index\MappingInterface;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface as ContainerConfigInterface;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use Gally\Search\Elasticsearch\SpellcheckerInterface;

/**
 * Prepare a fulltext search query.
 */
class FulltextQueryBuilder
{
    /**
     * @param QueryFactory          $queryFactory          Query factory (used to build sub queries)
     * @param SearchableFieldFilter $searchableFieldFilter Searchable field filters models
     * @param FuzzyFieldFilter      $fuzzyFieldFilter      Fuzzy field filters models
     */
    public function __construct(
        private QueryFactory $queryFactory,
        private SearchableFieldFilter $searchableFieldFilter,
        private FuzzyFieldFilter $fuzzyFieldFilter,
    ) {
    }

    /**
     * Create the fulltext search query.
     *
     * @param ContainerConfigInterface $containerConfig Search request container configuration
     * @param string|array             $queryText       The text query
     * @param int                      $spellingType    The type of spellchecked applied
     * @param float                    $boost           Boost of the created query
     */
    public function create(
        ContainerConfigInterface $containerConfig,
        string|array $queryText,
        int $spellingType,
        float $boost = 1,
    ): ?QueryInterface {
        $query = null;

        $fuzzySpellingTypes = [SpellcheckerInterface::SPELLING_TYPE_FUZZY, SpellcheckerInterface::SPELLING_TYPE_MOST_FUZZY];

        if (\is_array($queryText)) {
            $queries = [];
            foreach ($queryText as $currentQueryText) {
                $queries[] = $this->create($containerConfig, $currentQueryText, $spellingType);
            }
            $query = $this->queryFactory->create(QueryInterface::TYPE_BOOL, ['should' => $queries, 'boost' => $boost]);
        } elseif (SpellcheckerInterface::SPELLING_TYPE_PURE_STOPWORDS == $spellingType) {
            $query = $this->getPureStopwordsQuery($containerConfig, $queryText, $boost);
        } elseif (\in_array($spellingType, $fuzzySpellingTypes, true)) {
            $query = $this->getSpellcheckedQuery($containerConfig, $queryText, $spellingType, $boost);
        }

        if (null === $query) {
            $queryParams = [
                'query' => $this->getWeightedSearchQuery($containerConfig, $queryText),
                'filter' => $this->getCutoffFrequencyQuery($containerConfig, $queryText),
                'boost' => $boost,
            ];
            $query = $this->queryFactory->create(QueryInterface::TYPE_FILTER, $queryParams);
        }

        return $query;
    }

    /**
     * Provides a common search query for the searched text.
     *
     * @param ContainerConfigInterface $containerConfig Search request container configuration
     * @param string                   $queryText       The text query
     */
    private function getCutoffFrequencyQuery(ContainerConfigInterface $containerConfig, string $queryText): QueryInterface
    {
        $relevanceConfig = $containerConfig->getRelevanceConfig();

        $queryParams = [
            'fields' => array_fill_keys([MappingInterface::DEFAULT_SEARCH_FIELD, 'sku'], 1),
            'queryText' => $queryText,
            'cutoffFrequency' => $relevanceConfig->getCutOffFrequency(),
            'minimumShouldMatch' => $relevanceConfig->getMinimumShouldMatch(),
        ];

        return $this->queryFactory->create(QueryInterface::TYPE_MULTIMATCH, $queryParams);
    }

    /**
     * Provides a weighted search query (multi match) using mapping field configuration.
     *
     * @param ContainerConfigInterface $containerConfig Search request container configuration
     * @param string                   $queryText       The text query
     */
    private function getWeightedSearchQuery(ContainerConfigInterface $containerConfig, string $queryText): QueryInterface
    {
        $relevanceConfig = $containerConfig->getRelevanceConfig();
        $phraseMatchBoost = $relevanceConfig->getPhraseMatchBoost();
        $defaultSearchField = MappingInterface::DEFAULT_SEARCH_FIELD;
        $sortableAnalyzer = FieldInterface::ANALYZER_SORTABLE;
        $phraseAnalyzer = FieldInterface::ANALYZER_WHITESPACE;

        if (str_word_count($queryText) > 1) {
            $phraseAnalyzer = FieldInterface::ANALYZER_SHINGLE;
        }

        $searchFields = array_merge(
            $this->getWeightedFields($containerConfig, null, $this->searchableFieldFilter, $defaultSearchField),
            $this->getWeightedFields($containerConfig, $phraseAnalyzer, $this->searchableFieldFilter, $defaultSearchField, $phraseMatchBoost ?: 1),
            $this->getWeightedFields($containerConfig, $sortableAnalyzer, $this->searchableFieldFilter, null, 2 * ($phraseMatchBoost ?: 1))
        );

        $queryParams = [
            'fields' => $searchFields,
            'queryText' => $queryText,
            'minimumShouldMatch' => '1',
            'cutoffFrequency' => $relevanceConfig->getCutOffFrequency(),
            'tieBreaker' => $relevanceConfig->getTieBreaker(),
        ];

        return $this->queryFactory->create(QueryInterface::TYPE_MULTIMATCH, $queryParams);
    }

    /**
     * Build a query when the fulltext search query contains only stopwords.
     *
     * @param ContainerConfigInterface $containerConfig Search request container configuration
     * @param string                   $queryText       The text query
     * @param float                    $boost           Boost of the created query.e
     */
    private function getPureStopwordsQuery(ContainerConfigInterface $containerConfig, string $queryText, float $boost): QueryInterface
    {
        $relevanceConfig = $containerConfig->getRelevanceConfig();

        $analyzer = FieldInterface::ANALYZER_WHITESPACE;
        if (str_word_count($queryText) > 1) {
            $analyzer = FieldInterface::ANALYZER_SHINGLE;
        }

        $defaultSearchField = MappingInterface::DEFAULT_SEARCH_FIELD;

        $searchFields = $this->getWeightedFields($containerConfig, $analyzer, $this->searchableFieldFilter, $defaultSearchField);

        $queryParams = [
            'fields' => $searchFields,
            'queryText' => $queryText,
            'minimumShouldMatch' => '100%',
            'tieBreaker' => $relevanceConfig->getTieBreaker(),
            'boost' => $boost,
        ];

        return $this->queryFactory->create(QueryInterface::TYPE_MULTIMATCH, $queryParams);
    }

    /**
     * Spellchecked query building.
     *
     * @param ContainerConfigInterface $containerConfig Search request container configuration
     * @param string                   $queryText       The text query
     * @param int                      $spellingType    The type of spellchecked applied
     * @param float                    $boost           Boost of the created query
     */
    private function getSpellcheckedQuery(
        ContainerConfigInterface $containerConfig,
        string $queryText,
        int $spellingType,
        float $boost
    ): ?QueryInterface {
        $query = null;

        $relevanceConfig = $containerConfig->getRelevanceConfig();
        $queryClauses = [];

        if ($relevanceConfig->isFuzzinessEnabled()) {
            $queryClauses[] = $this->getFuzzyQuery($containerConfig, $queryText);
        }

        if ($relevanceConfig->isPhoneticSearchEnabled()) {
            $queryClauses[] = $this->getPhoneticQuery($containerConfig, $queryText);
        }

        if (!empty($queryClauses)) {
            $queryParams = ['should' => $queryClauses, 'boost' => $boost];

            if (SpellcheckerInterface::SPELLING_TYPE_MOST_FUZZY == $spellingType) {
                $queryParams['must'] = [$this->getWeightedSearchQuery($containerConfig, $queryText)];
            }

            $query = $this->queryFactory->create(QueryInterface::TYPE_BOOL, $queryParams);
        }

        return $query;
    }

    /**
     * Fuzzy query part.
     *
     * @param ContainerConfigInterface $containerConfig Search request container configuration
     * @param string                   $queryText       The text query
     */
    private function getFuzzyQuery(ContainerConfigInterface $containerConfig, string $queryText): QueryInterface
    {
        $relevanceConfig = $containerConfig->getRelevanceConfig();
        $phraseMatchBoost = $relevanceConfig->getPhraseMatchBoost();

        $defaultSearchField = MappingInterface::DEFAULT_SPELLING_FIELD;

        $standardAnalyzer = FieldInterface::ANALYZER_WHITESPACE;
        $phraseAnalyzer = FieldInterface::ANALYZER_WHITESPACE;
        if (str_word_count($queryText) > 1) {
            $phraseAnalyzer = FieldInterface::ANALYZER_SHINGLE;
        }

        $searchFields = array_merge(
            $this->getWeightedFields($containerConfig, $standardAnalyzer, $this->fuzzyFieldFilter, $defaultSearchField),
            $this->getWeightedFields(
                $containerConfig,
                $phraseAnalyzer,
                $this->fuzzyFieldFilter,
                $defaultSearchField,
                ($phraseMatchBoost ?: 1)
            )
        );

        $queryParams = [
            'fields' => $searchFields,
            'queryText' => $queryText,
            'minimumShouldMatch' => '100%',
            'tieBreaker' => $relevanceConfig->getTieBreaker(),
            'fuzzinessConfig' => $relevanceConfig->getFuzzinessConfiguration(),
            'cutoffFrequency' => $relevanceConfig->getCutoffFrequency(),
        ];

        return $this->queryFactory->create(QueryInterface::TYPE_MULTIMATCH, $queryParams);
    }

    /**
     * Phonetic query part.
     *
     * @param ContainerConfigInterface $containerConfig Search request container configuration
     * @param string                   $queryText       The text query
     */
    private function getPhoneticQuery(ContainerConfigInterface $containerConfig, string $queryText): QueryInterface
    {
        $relevanceConfig = $containerConfig->getRelevanceConfig();
        $analyzer = FieldInterface::ANALYZER_PHONETIC;
        $defaultSearchField = MappingInterface::DEFAULT_SPELLING_FIELD;

        $searchFields = $this->getWeightedFields($containerConfig, $analyzer, $this->fuzzyFieldFilter, $defaultSearchField);

        $queryParams = [
            'fields' => $searchFields,
            'queryText' => $queryText,
            'minimumShouldMatch' => '100%',
            'tieBreaker' => $relevanceConfig->getTieBreaker(),
            'cutoffFrequency' => $relevanceConfig->getCutoffFrequency(),
        ];

        return $this->queryFactory->create(QueryInterface::TYPE_MULTIMATCH, $queryParams);
    }

    /**
     * Build an array of weighted fields to be searched with the ability to apply a filter callback method and a default field.
     *
     * @param ContainerConfigInterface  $containerConfig search request container config
     * @param string|null               $analyzer        target analyzer
     * @param FieldFilterInterface|null $fieldFilter     field filter
     * @param string|null               $defaultField    default search field
     * @param float                     $boost           additional boost applied to the fields (multiplicative)
     */
    private function getWeightedFields(
        ContainerConfigInterface $containerConfig,
        ?string $analyzer = null,
        ?FieldFilterInterface $fieldFilter = null,
        ?string $defaultField = null,
        float $boost = 1
    ): array {
        $mapping = $containerConfig->getMapping();

        return $mapping->getWeightedSearchProperties($analyzer, $defaultField, $boost, $fieldFilter);
    }
}
