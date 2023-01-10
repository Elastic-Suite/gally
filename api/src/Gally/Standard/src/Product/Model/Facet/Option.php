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

namespace Gally\Product\Model\Facet;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use Gally\GraphQl\Decoration\Resolver\Stage\ReadStage;
use Gally\Product\GraphQl\Type\Definition\FieldFilterInputType;
use Gally\Search\Model\Facet\Option as FacetOption;
use Gally\Search\Resolver\DummyResolver;

#[
    ApiResource(
        itemOperations: [
            'get' => [ // Useless api endpoint, but need by api platform in order to return item in the graphql one.
                'controller' => NotFoundAction::class,
                'read' => false,
                'output' => false,
            ],
        ],
        collectionOperations: [],
        paginationEnabled: false,
        graphql: [
            'viewMore' => [
                'collection_query' => DummyResolver::class,
                'read' => true,
                'deserialize' => false,
                'args' => [
                    'localizedCatalog' => ['type' => 'String!', 'description' => 'Localized Catalog'],
                    'aggregation' => ['type' => 'String!', 'description' => 'Source field to get complete aggregation'],
                    'search' => ['type' => 'String', 'description' => 'Query Text'],
                    'currentCategoryId' => ['type' => 'String', 'description' => 'Current category ID'],
                    'filter' => ['type' => '[' . FieldFilterInputType::NAME . ']', ReadStage::IS_GRAPHQL_GALLY_ARG_KEY => true],
                ],
            ],
        ],
        shortName: 'ProductFacetOption'
    )
]
class Option extends FacetOption
{
}
