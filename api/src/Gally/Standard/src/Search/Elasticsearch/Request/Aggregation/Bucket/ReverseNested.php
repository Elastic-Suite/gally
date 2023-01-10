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

namespace Gally\Search\Elasticsearch\Request\Aggregation\Bucket;

use Gally\Search\Elasticsearch\Request\BucketInterface;

/**
 * Reverse nested aggregation implementation.
 */
class ReverseNested extends AbstractBucket
{
    /**
     * {@inheritdoc}
     */
    public function getType(): string
    {
        return BucketInterface::TYPE_REVERSE_NESTED;
    }
}
