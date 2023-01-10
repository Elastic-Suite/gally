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

use Acme\Example\Example\GraphQl\Type\Definition\ExampleFieldFilterOperatorInputType;
use Acme\Example\Example\GraphQl\Type\Definition\ExampleFieldFilterCompositeInputType;
use Acme\Example\Example\Resolver\DummyCollectionResolver;
use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

#[
    ApiResource(
        collectionOperations: [],
        graphql: [
            'search' => [
                'pagination_type' => 'page',
                'collection_query' => DummyCollectionResolver::class,
                'args' => [
                    'indexName' => ['type' => 'String!', 'description' => 'Index name.'],
                    'search' => ['type' => 'String'],
                    'pageSize' => ['type' => 'Int'],
                    'currentPage' => ['type' => 'Int'],
                    'filterByOperator' => ['type' => ExampleFieldFilterOperatorInputType::NAME],
                    'filterByType' => ['type' => ExampleFieldFilterCompositeInputType::NAME],
                ],
            ]
        ],
        itemOperations: [
            'get' => [
                'controller' => NotFoundAction::class,
                'read' => false,
                'output' => false,
            ],
        ],
    ),
]

class ExampleResultDocument
{
    #[ApiProperty(
        identifier: true
    )]
    private string $id;

    /**
     * @var array
     */
    private array $data;

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * @param string $id
     */
    public function setId(string $id): void
    {
        $this->id = $id;
    }

    /**
     * @return array
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * @param array $data
     */
    public function setData(array $data): void
    {
        $this->data = $data;
    }
}
