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

namespace Elasticsuite\Product\Elasticsearch\Request\Aggregation;

/**
 * Catalog Product Search Request coverage.
 */
class Coverage
{
    public function __construct(
        private array $countByAttributeCode,
        private int $size,
    ) {
    }

    /**
     * Load the product count by attribute code.
     */
    public function getProductCountByAttributeCode(): array
    {
        return $this->countByAttributeCode;
    }

    /**
     * Get total count.
     */
    public function getSize(): int
    {
        return $this->size;
    }
}
