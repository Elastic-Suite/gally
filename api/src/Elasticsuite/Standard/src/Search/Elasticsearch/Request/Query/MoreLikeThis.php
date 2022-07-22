<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Elasticsuite\Search\Elasticsearch\Request\Query;

use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * More like this search request query implementation.
 */
class MoreLikeThis implements QueryInterface
{
    /**
     * @var string
     */
    public const DEFAULT_MINIMUM_SHOULD_MATCH = '1';

    /**
     * @var float
     */
    public const DEFAULT_BOOST_TERMS = 1.0;

    /**
     * @var int
     */
    public const DEFAULT_MIN_TERM_FREQ = 1;

    /**
     * @var int
     */
    public const DEFAULT_MAX_QUERY_TERMS = 25;

    /**
     * @var int
     */
    public const DEFAULT_MIN_DOC_FREQ = 2;

    /**
     * @var int
     */
    public const DEFAULT_MAX_DOC_FREQ = 100;

    private ?string $name;

    private float $boost;

    private array $fields;

    private array|string $like;

    private string $minimumShouldMatch;

    private float $boostTerms;

    private int $minTermFreq;

    private int $minDocFreq;

    private int $maxDocFreq;

    private int $maxQueryTerms;

    private bool $includeOriginalDocs;

    /**
     * Constructor.
     *
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
     *
     * @param array        $fields              used fields
     * @param array|string $like                MLT like clause (doc ids or query string)
     * @param string       $minimumShouldMatch  minimum should match in query generated
     * @param float        $boostTerms          TF-IDF term boosting value
     * @param int          $minTermFreq         minimum term freq for a term to be considered
     * @param int          $minDocFreq          minimum doc freq for a term to be considered
     * @param int          $maxDocFreq          maximum doc freq for a term to be considered
     * @param int          $maxQueryTerms       maximum number of terms in generated queries
     * @param bool         $includeOriginalDocs whether to include original doc in the result set
     * @param ?string      $name                query name
     * @param float        $boost               query boost
     */
    public function __construct(
        array $fields,
        array|string $like,
        string $minimumShouldMatch = self::DEFAULT_MINIMUM_SHOULD_MATCH,
        float $boostTerms = self::DEFAULT_BOOST_TERMS,
        int $minTermFreq = self::DEFAULT_MIN_TERM_FREQ,
        int $minDocFreq = self::DEFAULT_MIN_DOC_FREQ,
        int $maxDocFreq = self::DEFAULT_MAX_DOC_FREQ,
        int $maxQueryTerms = self::DEFAULT_MAX_QUERY_TERMS,
        bool $includeOriginalDocs = false,
        ?string $name = null,
        float $boost = QueryInterface::DEFAULT_BOOST_VALUE
    ) {
        $this->fields = $fields;
        $this->like = $like;
        $this->minimumShouldMatch = $minimumShouldMatch;
        $this->boostTerms = $boostTerms;
        $this->minTermFreq = $minTermFreq;
        $this->minDocFreq = $minDocFreq;
        $this->maxDocFreq = $maxDocFreq;
        $this->maxQueryTerms = $maxQueryTerms;
        $this->name = $name;
        $this->boost = $boost;
        $this->includeOriginalDocs = $includeOriginalDocs;
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
        return QueryInterface::TYPE_MORELIKETHIS;
    }

    /**
     * Fields used by the MLT query.
     */
    public function getFields(): array
    {
        return $this->fields;
    }

    /**
     * List of similar doc / queries.
     */
    public function getLike(): string|array
    {
        return $this->like;
    }

    /**
     * Minimum should match for the match query.
     */
    public function getMinimumShouldMatch(): string
    {
        return $this->minimumShouldMatch;
    }

    /**
     * Value of the TF-IDF term boost.
     */
    public function getBoostTerms(): float
    {
        return $this->boostTerms;
    }

    /**
     * Minimum term freq for a term to be considered.
     */
    public function getMinTermFreq(): int
    {
        return $this->minTermFreq;
    }

    /**
     * Minimum doc freq for a term to be considered.
     */
    public function getMinDocFreq(): int
    {
        return $this->minDocFreq;
    }

    /**
     * Maximum doc freq for a term to be considered.
     */
    public function getMaxDocFreq(): int
    {
        return $this->maxDocFreq;
    }

    /**
     * Maximum number of term per generated query.
     */
    public function getMaxQueryTerms(): int
    {
        return $this->maxQueryTerms;
    }

    /**
     * Indicates if original docs should be included in the result.
     */
    public function includeOriginalDocs(): bool
    {
        return $this->includeOriginalDocs;
    }
}
