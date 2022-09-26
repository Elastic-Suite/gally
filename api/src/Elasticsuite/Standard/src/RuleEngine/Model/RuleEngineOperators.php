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

namespace Elasticsuite\RuleEngine\Model;

use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\RuleEngine\Controller\RuleEngineOperatorsController;
use Elasticsuite\RuleEngine\Resolver\RuleEngineOperatorsResolver;
use Elasticsuite\User\Constant\Role;

#[
    ApiResource(
        itemOperations: [
            'rule_engine_operators' => [
                'security' => "is_granted('" . Role::ROLE_CONTRIBUTOR . "')",
                'method' => 'GET',
                'path' => 'rule_engine_operators',
                'read' => false,
                'deserialize' => false,
                'controller' => RuleEngineOperatorsController::class,
            ],
        ],
        collectionOperations: [],
        paginationEnabled: false,
        graphql: [
            'get' => [
                'item_query' => RuleEngineOperatorsResolver::class,
                'read' => false,
                'deserialize' => false,
                'args' => [],
                'security' => "is_granted('" . Role::ROLE_CONTRIBUTOR . "')",
            ],
        ],
    )
]

class RuleEngineOperators
{
    private string $id = 'rule_engine_operators';

    private array $operators = [];
    private array $operatorsBySourceFieldType = [];
    private array $operatorsValueType = [];

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getOperators(): ?array
    {
        return $this->operators;
    }

    public function setOperators(array $operators): self
    {
        $this->operators = $operators;

        return $this;
    }

    public function getOperatorsBySourceFieldType(): ?array
    {
        return $this->operatorsBySourceFieldType;
    }

    public function setOperatorsBySourceFieldType(array $operatorsBySourceFieldType): self
    {
        $this->operatorsBySourceFieldType = $operatorsBySourceFieldType;

        return $this;
    }

    public function getOperatorsValueType(): array
    {
        return $this->operatorsValueType;
    }

    public function setOperatorsValueType(array $operatorsValueType): void
    {
        $this->operatorsValueType = $operatorsValueType;
    }
}
