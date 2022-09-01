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

namespace Elasticsuite\Metadata\Model\SourceField;

class Weight
{
    public const WEIGHT_VALID_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    /**
     * Get valid weight values.
     *
     * @return int[]
     */
    public static function getValidWeight(): array
    {
        return self::WEIGHT_VALID_VALUES;
    }
}
