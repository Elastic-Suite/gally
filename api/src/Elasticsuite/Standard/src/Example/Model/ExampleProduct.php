<?php

namespace Elasticsuite\Example\Model;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Elasticsearch\DataProvider\Filter\TermFilter;

#[
    ApiResource(
        collectionOperations: ['get'],
        itemOperations: ['get'],
        attributes: [
            'elasticsuite_index' => 'catalog_product'
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
    product(id: "/products/1") {
        name
        sku
        description
    },

    products {
        edges {
            node {
                entity_id
                sku
                created_at
                updated_at
            }
        }
    }

    indices {
        id
        name
        health
        }
    }

    mutation {
        createIndex(input: {name : "test_2" }) {
            index {
                id
                name
                health
            }
            clientMutationId
        }
    }
     */
    public const DEFAULT_ATTRIBUTE = ['entity_id', 'name', 'type_id', 'sku', 'description', 'created_at', 'updated_at'];

    #[ApiProperty(
        identifier: true
    )]
    public string $entity_id;

    #[ApiProperty(
        description: 'name',
        openapiContext: [
            'example' => 'description'
        ]
    )]
    public array $name;
    public string $type_id;
    public string $sku;
    public array $description;
    public string $created_at;
    public string $updated_at;

    /** @var AttributeInterface[]  */
    public array $attributes;

    public function addAttribute(AttributeInterface $attribute)
    {
        $this->attributes[$attribute->getAttributeCode()] = $attribute;
    }
}
