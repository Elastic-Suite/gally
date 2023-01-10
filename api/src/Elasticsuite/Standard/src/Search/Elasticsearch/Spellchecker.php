<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Search\Elasticsearch;

use Elasticsearch\Client;
use Elasticsuite\Cache\Service\CacheManagerInterface;
use Elasticsuite\Index\Model\Index\Mapping\FieldInterface;
use Elasticsuite\Index\Model\Index\MappingInterface;

/**
 * Spellchecker Elasticsearch implementation.
 * This implementation rely on the ES term vectors API.
 */
class Spellchecker implements SpellcheckerInterface
{
    /**
     * Constructor.
     *
     * @param Client                $client       ES Client Factory
     * @param CacheManagerInterface $cacheManager ES cache manager
     */
    public function __construct(
        private Client $client,
        private CacheManagerInterface $cacheManager,
    ) {
    }

    /**
     * {@inheritDoc}
     */
    public function getSpellingType(Spellchecker\RequestInterface $request): int
    {
        return $this->cacheManager->get(
            $this->getCacheKey($request),
            fn (&$tags, &$ttl) => $this->loadSpellingType($request),
            [$request->getIndexName()]
        );
    }

    /**
     * Compute the spelling time using the engine.
     *
     * @param Spellchecker\RequestInterface $request spellchecking request
     */
    private function loadSpellingType(Spellchecker\RequestInterface $request): int
    {
        $spellingType = self::SPELLING_TYPE_FUZZY;

        try {
            $cutoffFrequencyLimit = $this->getCutoffFrequencyLimit($request);
            $termVectors = $this->getTermVectors($request);
            if (\is_array($termVectors) && isset($termVectors['docs'])) {
                $termVectors = current($termVectors['docs']);
            }
            $queryTermStats = $this->parseTermVectors($termVectors, $cutoffFrequencyLimit);

            if ($queryTermStats['total'] == $queryTermStats['stop']) {
                $spellingType = self::SPELLING_TYPE_PURE_STOPWORDS;
            } elseif ($queryTermStats['stop'] + $queryTermStats['exact'] == $queryTermStats['total']) {
                $spellingType = self::SPELLING_TYPE_EXACT;
            } elseif (0 == $queryTermStats['missing']) {
                $spellingType = self::SPELLING_TYPE_MOST_EXACT;
            } elseif ($queryTermStats['total'] - $queryTermStats['missing'] > 0) {
                $spellingType = self::SPELLING_TYPE_MOST_FUZZY;
            }
        } catch (\Exception) {
            $spellingType = self::SPELLING_TYPE_EXACT;
        }

        return $spellingType;
    }

    /**
     * Compute a unique caching key for the spellcheck request.
     *
     * @param Spellchecker\RequestInterface $request spellchecking request
     */
    private function getCacheKey(Spellchecker\RequestInterface $request): string
    {
        return implode('|', [$request->getIndexName(), $request->getQueryText()]);
    }

    /**
     * Count document into the index and then multiply it by the request cutoff frequency
     * to compute an absolute cutoff frequency limit (max number of doc).
     *
     * @param Spellchecker\RequestInterface $request the spellcheck request
     */
    private function getCutoffFrequencyLimit(Spellchecker\RequestInterface $request): float
    {
        $indexStatsResponse = $this->client->indices()->stats(['index' => $request->getIndexName()]);
        $indexStats = current($indexStatsResponse['indices']);
        $totalIndexedDocs = $indexStats['total']['docs']['count'];

        return $request->getCutoffFrequency() * $totalIndexedDocs;
    }

    /**
     * Run a term vectors query against the index and return the result.
     *
     * @param Spellchecker\RequestInterface $request the spellcheck request
     */
    private function getTermVectors(Spellchecker\RequestInterface $request): array|callable
    {
        $mTermVectorsQuery['body'] = [
            'docs' => [
                [
                    '_index' => $request->getIndexName(),
                    '_type' => '_doc',
                    'term_statistics' => true,
                    'fields' => [
                        MappingInterface::DEFAULT_SPELLING_FIELD,
                        MappingInterface::DEFAULT_SPELLING_FIELD . '.' . FieldInterface::ANALYZER_WHITESPACE,
                    ],
                    'doc' => [MappingInterface::DEFAULT_SPELLING_FIELD => $request->getQueryText()],
                ],
            ],
        ];

        return $this->client->mtermvectors($mTermVectorsQuery);
    }

    /**
     * Parse the terms vectors to extract stats on the query.
     * Result is an array containing :
     * - total    : number of terms into the query
     * - stop     : number of stopwords into the query
     * - exact    : number of terms correctly spelled into the query
     * - missing  : number of terms of the query not found into the index
     * - standard : number of terms of the query found using the standard analyzer.
     *
     * @param array $termVectors          the term vector query response
     * @param float $cutoffFrequencyLimit cutoff freq (max absolute number of docs to consider term as a stopword)
     */
    private function parseTermVectors(array $termVectors, float $cutoffFrequencyLimit): array
    {
        $queryTermStats = ['stop' => 0, 'exact' => 0, 'standard' => 0, 'missing' => 0];
        $statByPosition = $this->extractTermStatsByPosition($termVectors);

        foreach ($statByPosition as $positionStat) {
            $type = 'missing';
            if ($positionStat['doc_freq'] > 0) {
                $type = 'standard';
                if ($positionStat['doc_freq'] >= $cutoffFrequencyLimit) {
                    $type = 'stop';
                } elseif (\in_array(FieldInterface::ANALYZER_WHITESPACE, $positionStat['analyzers'], true)) {
                    $type = 'exact';
                }
            }
            ++$queryTermStats[$type];
        }

        $queryTermStats['total'] = \count($statByPosition);

        return $queryTermStats;
    }

    /**
     * Extract term stats by position from a term vectors query response.
     * Will return an array of doc_freq, analyzers and term by position.
     *
     * @param array $termVectors the term vector query response
     */
    private function extractTermStatsByPosition(array $termVectors): array
    {
        $statByPosition = [];
        $analyzers = [FieldInterface::ANALYZER_STANDARD, FieldInterface::ANALYZER_WHITESPACE];

        foreach ($termVectors['term_vectors'] as $propertyName => $fieldData) {
            $analyzer = $this->getAnalyzer($propertyName);
            if (\in_array($analyzer, $analyzers, true)) {
                foreach ($fieldData['terms'] as $term => $termStats) {
                    foreach ($termStats['tokens'] as $token) {
                        $positionKey = $token['position'];

                        if (!isset($termStats['doc_freq'])) {
                            $termStats['doc_freq'] = 0;
                        }

                        if (!isset($statByPosition[$positionKey])) {
                            $statByPosition[$positionKey]['term'] = $term;
                            $statByPosition[$positionKey]['doc_freq'] = $termStats['doc_freq'];
                        }

                        if ($termStats['doc_freq']) {
                            $statByPosition[$positionKey]['analyzers'][] = $analyzer;
                        }

                        $statByPosition[$positionKey]['doc_freq'] = max(
                            $termStats['doc_freq'],
                            $statByPosition[$positionKey]['doc_freq']
                        );
                    }
                }
            }
        }

        return $statByPosition;
    }

    /**
     * Extract analyser from a mapping property name.
     *
     * @param string $propertyName Property name (e.g. : search.whitespace)
     */
    private function getAnalyzer(string $propertyName): string
    {
        $analyzer = FieldInterface::ANALYZER_STANDARD;

        if (str_contains($propertyName, '.')) {
            $propertyNameParts = explode('.', $propertyName);
            $analyzer = end($propertyNameParts);
        }

        return $analyzer;
    }
}
