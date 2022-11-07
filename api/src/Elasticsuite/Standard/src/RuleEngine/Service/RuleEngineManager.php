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

namespace Elasticsuite\RuleEngine\Service;

use Elasticsuite\Exception\LogicException;
use Elasticsuite\RuleEngine\Model\RuleEngineGraphQlFilters;
use Elasticsuite\RuleEngine\Model\RuleEngineOperators;
use Elasticsuite\RuleEngine\Service\RuleType\AttributeRule;
use Elasticsuite\RuleEngine\Service\RuleType\CombinationRule;
use Elasticsuite\RuleEngine\Service\RuleType\RuleTypeInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Service\GraphQl\FilterManager;

class RuleEngineManager
{
    /**
     * @var RuleTypeInterface[]
     */
    private array $ruleTypes;

    public function __construct(
        private FilterManager $filterManager,
        private iterable $ruleTypeClasses,
    ) {
        $this->initRuleTypes();
    }

    public function initRuleTypes(): void
    {
        /** @var RuleTypeInterface $ruleTypeClass */
        foreach ($this->ruleTypeClasses as $ruleTypeClass) {
            $this->addRuleType($ruleTypeClass);
        }
    }

    public function addRuleType(RuleTypeInterface $ruleType): void
    {
        $this->ruleTypes[$ruleType->getRuleType()] = $ruleType;
    }

    /**
     * @@return RuleTypeInterface[]
     */
    public function getRuleTypes(): array
    {
        return $this->ruleTypes;
    }

    public function getRuleEngineOperators(): RuleEngineOperators
    {
        /** @var AttributeRule $attributeRuleType */
        $attributeRuleType = $this->getRuleTypes()[AttributeRule::RULE_TYPE];
        $ruleEngineOperators = new RuleEngineOperators();
        $ruleEngineOperators->setOperators($attributeRuleType->getOperators());
        $ruleEngineOperators->setOperatorsBySourceFieldType($attributeRuleType->getOperatorsBySourceFiledType());
        $ruleEngineOperators->setOperatorsValueType($attributeRuleType->getValueTypeByOperators());

        return $ruleEngineOperators;
    }

    public function getRuleEngineGraphQlFilters(array $rule): RuleEngineGraphQlFilters
    {
        $ruleEngineGraphQlFilters = new RuleEngineGraphQlFilters();
        $ruleEngineGraphQlFilters->setGraphQlFilters($this->transformRuleToGraphQlFilters($rule));

        return $ruleEngineGraphQlFilters;
    }

    public function transformRuleToGraphQlFilters(array $rule): array
    {
        if (!isset($rule['type'])) {
            throw new LogicException('The rule type is not set.');
        }

        if (CombinationRule::RULE_TYPE !== $rule['type']) {
            throw new LogicException('The first rule node should be a combination.');
        }

        return $this->getRuleTypes()[CombinationRule::RULE_TYPE]->transformRuleNodeToGraphQlFilter($rule);
    }

    public function transformRuleNodeToGraphQlFilter(array $rule): array
    {
        if (!isset($rule['type'])) {
            throw new LogicException('The rule type is not set.');
        }

        if (!\in_array($rule['type'], array_keys($this->getRuleTypes()), true)) {
            throw new LogicException("The rule type '{$rule['type']}' does not exist.");
        }

        return $this->getRuleTypes()[$rule['type']]->transformRuleNodeToGraphQlFilter($rule);
    }

    public function transformRuleToElasticsuiteFilters(array $rule, ContainerConfigurationInterface $containerConfig, array $filterContext = []): array
    {
        return $this->filterManager->transformToElasticsuiteFilters(
            [$this->transformRuleToGraphQlFilters($rule)],
            $containerConfig,
            $filterContext
        );
    }
}
