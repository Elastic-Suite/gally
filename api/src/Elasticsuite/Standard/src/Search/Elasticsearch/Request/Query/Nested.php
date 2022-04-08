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
 * Nested queries definition implementation.
 */
class Nested implements QueryInterface
{
    public const SCORE_MODE_AVG = 'avg';
    public const SCORE_MODE_SUM = 'sum';
    public const SCORE_MODE_MIN = 'min';
    public const SCORE_MODE_MAX = 'max';
    public const SCORE_MODE_NONE = 'none';

    private string $scoreMode;

    private ?string $name;

    private int $boost;

    private string $path;

    private ?QueryInterface $query;

    /**
     * Constructor.
     *
     * @param string          $path      nested path
     * @param ?QueryInterface $query     nested query
     * @param string          $scoreMode Score mode of the nested query
     * @param ?string         $name      query name
     * @param int             $boost     query boost
     */
    public function __construct(
        string $path,
        ?QueryInterface $query = null,
        string $scoreMode = self::SCORE_MODE_NONE,
        string $name = null,
        int $boost = QueryInterface::DEFAULT_BOOST_VALUE
    ) {
        $this->name = $name;
        $this->boost = $boost;
        $this->path = $path;
        $this->scoreMode = $scoreMode;
        $this->query = $query;
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
    public function getBoost(): int
    {
        return $this->boost;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return QueryInterface::TYPE_NESTED;
    }

    /**
     * Nested query path.
     */
    public function getPath(): string
    {
        return $this->path;
    }

    /**
     * Nested query score mode.
     */
    public function getScoreMode(): string
    {
        return $this->scoreMode;
    }

    /**
     * Nested query.
     */
    public function getQuery(): ?QueryInterface
    {
        return $this->query;
    }
}
