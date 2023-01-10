<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Acme\Example
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Acme\Example\Example\Model;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Elasticsearch\DataProvider\Filter\TermFilter;
use Gally\User\Constant\Role;
use Gally\Entity\Model\Attribute\AttributeInterface;

#[
    ApiResource(
        collectionOperations: ['get'],
        graphql: [
            'item_query',
            'collection_query',
        ],
        itemOperations: ['get'],
        attributes: [
            'gally' => [
                'index' => 'catalog_product',
                'stitching' => ['property' => 'attributes'],
                'metadata' => ['entity' => 'product'],
            ],
        ],
        paginationItemsPerPage: 2,
        paginationMaximumItemsPerPage: 10,
    ),
    ApiFilter(TermFilter::class, properties: ['type_id']),
]
class ExampleProduct
{
    /**
     * GraphQl examples :
     * {
     * product(id: "/products/1") {
     * name
     * sku
     * description
     * },.
     *
     * products {
     * edges {
     * node {
     * entity_id
     * sku
     * created_at
     * updated_at
     * }
     * }
     * }
     *
     * indices {
     * id
     * name
     * health
     * }
     * }
     *
     * mutation {
     * createIndex(input: {name : "test_2" }) {
     * index {
     * id
     * name
     * health
     * }
     * clientMutationId
     * }
     * }
     */
    public const DEFAULT_ATTRIBUTE = ['entity_id', 'type_id', 'description', 'created_at', 'updated_at'];

    #[ApiProperty(
        identifier: true
    )]
    public string $entity_id;

    #[ApiProperty(
        description: 'description',
        openapiContext: [
            'example' => 'description',
        ]
    )]
    public array $description;
    public string $type_id;
    public string $created_at;
    public string $updated_at;

    /** @var AttributeInterface[] */
    public array $attributes;

    public function addAttribute(AttributeInterface $attribute)
    {
        $this->attributes[$attribute->getAttributeCode()] = $attribute;
    }
}
