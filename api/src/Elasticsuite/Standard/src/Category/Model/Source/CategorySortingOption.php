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

namespace Elasticsuite\Category\Model\Source;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\Metadata\Model\SourceField;

#[ApiResource(
    itemOperations: [],
    collectionOperations: [
        'get' => ['pagination_enabled' => false],
    ],
    graphql: [
        'collection_query' => ['pagination_enabled' => false],
    ],
    attributes: [
        'elasticsuite' => [
            // Allows to add cache tag "/source_fields" in the HTTP response to invalidate proxy cache when a source field is saved.
            'cache_tag' => ['resource_classes' => [SourceField::class]],
        ],
    ],
)]
class CategorySortingOption
{
    #[ApiProperty(identifier: true)]
    public string $code;

    public string $label;
}
