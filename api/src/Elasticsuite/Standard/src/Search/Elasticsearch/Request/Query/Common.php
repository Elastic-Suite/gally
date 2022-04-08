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
 * ES common query definition implementation.
 */
class Common extends MatchQuery
{
    /**
     * @var float
     */
    public const DEFAULT_CUTOFF_FREQUENCY = 0.1;

    private float $cutoffFrequency;

    /**
     * Constructor.
     *
     * @param string  $queryText          Matched text
     * @param string  $field              Query field
     * @param float   $cutoffFrequency    Cutoff frequency
     * @param string  $minimumShouldMatch Minimum should match for the match query
     * @param ?string $name               Query name
     * @param int     $boost              Query boost
     */
    public function __construct(
        string $queryText,
        string $field,
        float $cutoffFrequency = self::DEFAULT_CUTOFF_FREQUENCY,
        string $minimumShouldMatch = self::DEFAULT_MINIMUM_SHOULD_MATCH,
        ?string $name = null,
        int $boost = QueryInterface::DEFAULT_BOOST_VALUE
    ) {
        parent::__construct($queryText, $field, $minimumShouldMatch, $name, $boost);
        $this->cutoffFrequency = $cutoffFrequency;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return QueryInterface::TYPE_COMMON;
    }

    /**
     * Query cutoff frequency.
     */
    public function getCutoffFrequency(): float
    {
        return $this->cutoffFrequency;
    }
}
