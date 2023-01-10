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

namespace Elasticsuite\Search\Elasticsearch\Builder\Request\SortOrder;

use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;

/**
 * Nested sort order implementation.
 */
class Nested extends Standard
{
    private ?QueryInterface $nestedFilter;

    private string $nestedPath;

    private string $scoreMode;

    /**
     * Constructor.
     *
     * @param string          $field        Sort order field
     * @param ?string         $direction    Sort order direction
     * @param string          $nestedPath   Nested sort path
     * @param ?QueryInterface $nestedFilter The filter applied to the nested sort
     * @param ?string         $scoreMode    Method used to aggregate the sort if there is many match for the filter
     * @param ?string         $name         Sort order name
     * @param ?string         $missing      How to treat missing values
     */
    public function __construct(
        string $field,
        string $nestedPath,
        ?QueryInterface $nestedFilter = null,
        ?string $direction = self::SORT_ASC,
        ?string $scoreMode = self::SCORE_MODE_MIN,
        ?string $name = null,
        ?string $missing = null
    ) {
        parent::__construct($field, $direction, $name, $missing);

        $this->nestedFilter = $nestedFilter;
        $this->nestedPath = $nestedPath;
        $this->scoreMode = $scoreMode;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return SortOrderInterface::TYPE_NESTED;
    }

    /**
     * The filter applied to the nested sort.
     */
    public function getNestedFilter(): ?QueryInterface
    {
        return $this->nestedFilter;
    }

    /**
     * Nested sort path.
     */
    public function getNestedPath(): string
    {
        return $this->nestedPath;
    }

    /**
     * Method used to aggregate the sort if there is many match for the filter.
     */
    public function getScoreMode(): string
    {
        return $this->scoreMode;
    }
}
