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

namespace Gally\Product\Model;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use Gally\Entity\Model\Attribute\AttributeInterface;
use Gally\GraphQl\Decoration\Resolver\Stage\ReadStage;
use Gally\Product\GraphQl\Type\Definition\FieldFilterInputType;
use Gally\Product\GraphQl\Type\Definition\ProductRequestTypeEnumType;
use Gally\Product\GraphQl\Type\Definition\SortInputType;
use Gally\Search\Model\Document;
use Gally\Search\Resolver\DummyResolver;

#[
    ApiResource(
        collectionOperations: [],
        graphql: [
            'search' => [
                'collection_query' => DummyResolver::class,
                'pagination_type' => 'page',
                'args' => [
                    'localizedCatalog' => ['type' => 'String!', 'description' => 'Localized Catalog'],
                    'requestType' => ['type' => ProductRequestTypeEnumType::NAME . '!', 'description' => 'Request Type'],
                    'currentPage' => ['type' => 'Int'],
                    'search' => ['type' => 'String', 'description' => 'Query Text'],
                    'currentCategoryId' => ['type' => 'String', 'description' => 'Current category ID'],
                    'pageSize' => ['type' => 'Int'],
                    'sort' => ['type' => SortInputType::NAME],
                    'filter' => ['type' => '[' . FieldFilterInputType::NAME . ']', ReadStage::IS_GRAPHQL_GALLY_ARG_KEY => true],
                ],
                'read' => true, // Required so the dataprovider is called.
                'deserialize' => true,
                'write' => false,
                'serialize' => true,
            ],
        ],
        itemOperations: [
            'get' => [
                'controller' => NotFoundAction::class,
                'read' => false,
                'output' => false,
            ],
        ],
        attributes: [
            'gally' => [
                'stitching' => ['property' => 'attributes'],
                'metadata' => ['entity' => 'product'],
            ],
        ],
        paginationClientEnabled: true,
        paginationClientItemsPerPage: true,
        paginationClientPartial: false,
        paginationEnabled: true,
        paginationItemsPerPage: 30, // Default items per page if pageSize not provided.
        paginationMaximumItemsPerPage: 100, // Max. allowed items per page.
    ),
]
class Product extends Document
{
    public const DEFAULT_ATTRIBUTES = ['_id', 'id', 'data', 'source', 'index', 'type', 'score'];

    /** @var AttributeInterface[] */
    public array $attributes = [];

    public function addAttribute(AttributeInterface $attribute)
    {
        $this->attributes[$attribute->getAttributeCode()] = $attribute;
    }
}
