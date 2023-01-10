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

namespace Elasticsuite\Search\Elasticsearch\Request\Query;

use Elasticsuite\Search\Elasticsearch\Request\Container\RelevanceConfiguration\FuzzinessConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Multi match search request query implementation.
 */
class MultiMatch implements QueryInterface
{
    /**
     * @var string
     */
    public const DEFAULT_MINIMUM_SHOULD_MATCH = '1';

    /**
     * @var float
     */
    public const DEFAULT_TIE_BREAKER = 1.0;

    /**
     * @var string
     */
    public const DEFAULT_MATCH_TYPE = 'best_fields';

    private ?string $name;

    private float $boost;

    private string $queryText;

    private array $fields;

    private string $minimumShouldMatch;

    private float $tieBreaker;

    private ?FuzzinessConfigurationInterface $fuzzinessConfig;

    private ?float $cutoffFrequency;

    private string $matchType;

    /**
     * @param string                           $queryText          matched text
     * @param array                            $fields             query fields as key with their weight as values
     * @param string                           $minimumShouldMatch minimum should match for the match query
     * @param float                            $tieBreaker         tie breaker for the multi_match query
     * @param ?string                          $name               query name
     * @param float                            $boost              query boost
     * @param ?FuzzinessConfigurationInterface $fuzzinessConfig    The fuzziness Configuration
     * @param ?float                           $cutoffFrequency    cutoff frequency
     * @param string                           $matchType          the match type
     */
    public function __construct(
        string $queryText,
        array $fields,
        string $minimumShouldMatch = self::DEFAULT_MINIMUM_SHOULD_MATCH,
        float $tieBreaker = self::DEFAULT_TIE_BREAKER,
        ?string $name = null,
        float $boost = QueryInterface::DEFAULT_BOOST_VALUE,
        ?FuzzinessConfigurationInterface $fuzzinessConfig = null,
        ?float $cutoffFrequency = null,
        string $matchType = self::DEFAULT_MATCH_TYPE
    ) {
        $this->name = $name;
        $this->queryText = $queryText;
        $this->fields = $fields;
        $this->minimumShouldMatch = $minimumShouldMatch;
        $this->tieBreaker = $tieBreaker;
        $this->boost = $boost;
        $this->fuzzinessConfig = $fuzzinessConfig;
        $this->cutoffFrequency = $cutoffFrequency;
        $this->matchType = $matchType;
    }

    /**
     * {@inheritDoc}
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * {@inheritDoc}
     */
    public function getBoost(): float
    {
        return $this->boost;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return QueryInterface::TYPE_MULTIMATCH;
    }

    /**
     * Query match text.
     */
    public function getQueryText(): string
    {
        return $this->queryText;
    }

    /**
     * Query fields (weighted).
     */
    public function getFields(): array
    {
        return $this->fields;
    }

    /**
     * Minimum should match for the match query.
     */
    public function getMinimumShouldMatch(): string
    {
        return $this->minimumShouldMatch;
    }

    /**
     * Tie-breaker for the multi_match query.
     */
    public function getTieBreaker(): float
    {
        return $this->tieBreaker;
    }

    /**
     * Retrieve Fuzziness Configuration if any.
     */
    public function getFuzzinessConfiguration(): ?FuzzinessConfigurationInterface
    {
        return $this->fuzzinessConfig;
    }

    /**
     * Query cutoff frequency.
     */
    public function getCutoffFrequency(): ?float
    {
        return $this->cutoffFrequency;
    }

    /**
     * Query match type.
     */
    public function getMatchType(): string
    {
        return $this->matchType;
    }
}
