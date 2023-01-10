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

namespace Gally\RuleEngine\Model;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use Gally\RuleEngine\Controller\RuleEngineGraphQlFiltersController;
use Gally\RuleEngine\Resolver\RuleEngineGraphQlFiltersResolver;
use Gally\User\Constant\Role;
use Symfony\Component\HttpFoundation\Response;

#[
    ApiResource(
        itemOperations: [
            'get' => [
                'controller' => NotFoundAction::class,
                'read' => false,
                'output' => false,
            ],
        ],
        collectionOperations: [
            'rule_engine_filters' => [
                'security' => "is_granted('" . Role::ROLE_CONTRIBUTOR . "')",
                'method' => 'POST',
                'path' => 'rule_engine_graphql_filters',
                'read' => false,
                'deserialize' => false,
                'controller' => RuleEngineGraphQlFiltersController::class,
                'status' => Response::HTTP_OK,
                'openapi_context' => [
                    'requestBody' => [
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'rule' => ['type' => 'string'],
                                    ],
                                ],
                                'example' => [
                                    'rule' => '{"type": "combination", "operator": "all", "value": "true", "children": [{"type": "attribute", "field": "id", "operator": "eq", "attribute_type": "int", "value": 1}]}',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
        paginationEnabled: false,
        graphql: [
            'get' => [
                'item_query' => RuleEngineGraphQlFiltersResolver::class,
                'read' => false,
                'deserialize' => false,
                'args' => [
                    'rule' => ['type' => 'String!'],
                ],
                'security' => "is_granted('" . Role::ROLE_CONTRIBUTOR . "')",
            ],
        ],
    )
]

class RuleEngineGraphQlFilters
{
    private string $id = 'rule_engine_graphql_filters';

    private array $graphQlFilters = [];

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getGraphQlFilters(): array
    {
        return $this->graphQlFilters;
    }

    public function setGraphQlFilters(array $graphQlFilters): void
    {
        $this->graphQlFilters = $graphQlFilters;
    }
}
