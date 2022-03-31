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

namespace Elasticsuite\Example\Model;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Elasticsearch\DataProvider\Filter\TermFilter;
use Elasticsuite\User\Constant\Role;

#[
    ApiResource(
        collectionOperations: ['get'],
        graphql: [
            'item_query',
            'collection_query',
            'create' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
            'update' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
            'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        ],
        itemOperations: ['get'],
        attributes: [
            'elasticsuite_index' => 'catalog_product',
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
    public const DEFAULT_ATTRIBUTE = ['entity_id', 'name', 'type_id', 'sku', 'description', 'created_at', 'updated_at'];

    #[ApiProperty(
        identifier: true
    )]
    public string $entity_id;

    #[ApiProperty(
        description: 'name',
        openapiContext: [
            'example' => 'description',
        ]
    )]
    public array $name;
    public string $type_id;
    public string $sku;
    public array $description;
    public string $created_at;
    public string $updated_at;

    /** @var AttributeInterface[] */
    public array $attributes;

    public function addAttribute(AttributeInterface $attribute)
    {
        $this->attributes[$attribute->getAttributeCode()] = $attribute;
    }
}
