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

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\ConfigResolver;

use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;

class NumericAggregationConfigResolver implements FieldAggregationConfigResolverInterface
{
    public function supports(SourceField $sourceField): bool
    {
        return \in_array(
            $sourceField->getType(),
            [
                SourceField\Type::TYPE_INT,
                SourceField\Type::TYPE_FLOAT,
            ], true
        );
    }

    public function getConfig(SourceField $sourceField): array
    {
        return [
            'name' => $sourceField->getCode(),
            'type' => BucketInterface::TYPE_HISTOGRAM,
            'minDocCount' => 1,
        ];
    }
}
