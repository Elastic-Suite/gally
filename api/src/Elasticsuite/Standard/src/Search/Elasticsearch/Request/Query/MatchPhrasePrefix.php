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

use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * match_phrase_prefix query definition implementation.
 */
class MatchPhrasePrefix implements QueryInterface
{
    private ?string $name;

    private float $boost;

    private string $queryText;

    private string $field;

    private int $maxExpansions;

    /**
     * Constructor.
     *
     * @param string  $queryText     Matched text
     * @param string  $field         Query field
     * @param int     $maxExpansions Max expansions
     * @param ?string $name          Query name
     * @param float   $boost         Query boost
     */
    public function __construct(
        string $queryText,
        string $field,
        int $maxExpansions = 10,
        ?string $name = null,
        float $boost = QueryInterface::DEFAULT_BOOST_VALUE
    ) {
        $this->name = $name;
        $this->queryText = $queryText;
        $this->field = $field;
        $this->boost = $boost;
        $this->maxExpansions = $maxExpansions;
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
    public function getBoost(): float|null
    {
        return $this->boost;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return QueryInterface::TYPE_MATCHPHRASEPREFIX;
    }

    /**
     * Query match text.
     */
    public function getQueryText(): string
    {
        return $this->queryText;
    }

    /**
     * Query field.
     */
    public function getField(): string
    {
        return $this->field;
    }

    /**
     * Max expansions.
     */
    public function getMaxExpansions(): int
    {
        return $this->maxExpansions;
    }
}
