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

namespace Elasticsuite\Search\Model\Facet;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\GraphQl\Decoration\Resolver\Stage\ReadStage;
use Elasticsuite\Search\GraphQl\Type\Definition\FieldFilterInputType;
use Elasticsuite\Search\Resolver\DummyResolver;

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
                    'entityType' => ['type' => 'String!', 'description' => 'Entity Type'],
                    'catalogId' => ['type' => 'String!', 'description' => 'Catalog ID'],
                    'aggregation' => ['type' => 'String!', 'description' => 'Source field to get complete aggregation'],
                    'search' => ['type' => 'String', 'description' => 'Query Text'],
                    'filter' => ['type' => '[' . FieldFilterInputType::NAME . ']', ReadStage::IS_GRAPHQL_ELASTICSUITE_ARG_KEY => true],
                ],
            ],
        ],
        shortName: 'FacetOption'
    )
]
class Option
{
    private string $value;
    private string $label;
    private int $count;

    public function __construct(string $value, string $label, int $count)
    {
        $this->value = $value;
        $this->label = $label;
        $this->count = $count;
    }

    #[ApiProperty(identifier: true)]
    public function getId(): string
    {
        // We need and id field different that the value field because authorized characters in the id field are limited
        // Api platform use this field to build entity URI.
        return str_replace('.', ' ', urlencode($this->value));
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function getLabel(): string
    {
        return $this->label;
    }

    public function getCount(): int
    {
        return $this->count;
    }
}
