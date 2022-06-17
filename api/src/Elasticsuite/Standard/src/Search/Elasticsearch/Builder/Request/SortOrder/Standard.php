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

namespace Elasticsuite\Search\Elasticsearch\Builder\Request\SortOrder;

use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;

/**
 * Normal sort order implementation.
 */
class Standard implements SortOrderInterface
{
    private ?string $name;

    private ?string $field;

    private string $direction;

    private string $missing;

    /**
     * Constructor.
     *
     * @param string  $field     Sort order field
     * @param ?string $direction Sort order direction
     * @param ?string $name      Sort order name
     * @param ?string $missing   How to treat missing values
     */
    public function __construct(string $field, ?string $direction = self::SORT_ASC, ?string $name = null, ?string $missing = null)
    {
        $this->field = $field;
        $this->direction = $direction;
        $this->name = $name;
        $this->missing = $missing ?? (self::SORT_ASC === $direction ? self::MISSING_LAST : self::MISSING_FIRST);
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
    public function getField(): string
    {
        return $this->field;
    }

    /**
     * {@inheritDoc}
     */
    public function getDirection(): string
    {
        return $this->direction ?? self::SORT_ASC;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return SortOrderInterface::TYPE_STANDARD;
    }

    /**
     * {@inheritDoc}
     */
    public function getMissing(): string
    {
        return $this->missing;
    }
}
