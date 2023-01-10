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

namespace Gally\Search\Elasticsearch\Request;

/**
 * Interface for metrics.
 */
interface AggregationInterface
{
    /**
     * Aggregation type.
     */
    public function getType(): string;

    /**
     * Aggregation name.
     */
    public function getName(): string;
}
