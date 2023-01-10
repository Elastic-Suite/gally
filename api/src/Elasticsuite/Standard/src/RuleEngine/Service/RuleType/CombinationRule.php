<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\RuleEngine\Service\RuleType;

use Elasticsuite\Entity\GraphQl\Type\Definition\Filter\BoolFilterInputType;
use Elasticsuite\Exception\LogicException;
use Elasticsuite\RuleEngine\Service\RuleEngineManager;

class CombinationRule extends AbstractRuleType implements RuleTypeInterface
{
    public const RULE_TYPE = 'combination';

    public const ANY_OPERATOR = 'any';
    public const ALL_OPERATOR = 'all';

    public const TRUE_VALUE = 'true';
    public const FALSE_VALUE = 'false';

    public const VALUES = [
        self::TRUE_VALUE,
        self::FALSE_VALUE,
    ];

    public const OPERATORS = [
        self::ANY_OPERATOR,
        self::ALL_OPERATOR,
    ];

    public function __construct(
        private BoolFilterInputType $boolFilterInputType,
        private RuleEngineManager $ruleEngineManager,
    ) {
    }

    public function transformRuleNodeToGraphQlFilterWithExplicitNot(array $ruleNode): array
    {
        $this->validateRuleData($ruleNode);
        $operator = $ruleNode['operator'];
        $value = $ruleNode['value'];

        $childrenGraphQlFilters = [];
        foreach ($ruleNode['children'] as $childNode) {
            $ruleNodeItem = $this->ruleEngineManager->transformRuleNodeToGraphQlFilter($childNode);
            if (self::FALSE_VALUE == $value) {
                $ruleNodeItem = $this->boolFilterInputType->getGraphQlFilter(
                    ['_not' => $ruleNodeItem]
                );
            }
            $childrenGraphQlFilters[] = $ruleNodeItem;
        }

        $boolOperator = self::ALL_OPERATOR === $operator ? '_must' : '_should';

        return !empty($childrenGraphQlFilters) ? $this->boolFilterInputType->getGraphQlFilter([$boolOperator => $childrenGraphQlFilters]) : [];
    }

    public function transformRuleNodeToGraphQlFilter(array $ruleNode): array
    {
        $fields = [];
        $this->validateRuleData($ruleNode);

        if (self::ALL_OPERATOR === $ruleNode['operator']) {
            if (self::TRUE_VALUE == $ruleNode['value']) {
                // A && B
                $fields['_must'] = $this->processChildrenNode($ruleNode['children']);
            } elseif (self::FALSE_VALUE == $ruleNode['value']) {
                // !A && !B == !(A || B) (De Morgan's laws @see https://en.wikipedia.org/wiki/De_Morgan%27s_laws)
                $fields['_not'] = $this->boolFilterInputType->getGraphQlFilter(
                    ['_should' => $this->processChildrenNode($ruleNode['children'])]
                );
            }
        } elseif (self::ANY_OPERATOR === $ruleNode['operator']) {
            if (self::TRUE_VALUE == $ruleNode['value']) {
                // A || B
                $fields['_should'] = $this->processChildrenNode($ruleNode['children']);
            } elseif (self::FALSE_VALUE == $ruleNode['value']) {
                // !A || !B == !(A && B) (De Morgan's laws @see https://en.wikipedia.org/wiki/De_Morgan%27s_laws)
                $fields['_not'] = $this->boolFilterInputType->getGraphQlFilter(
                    ['_must' => $this->processChildrenNode($ruleNode['children'])]
                );
            }
        }

        return $this->boolFilterInputType->getGraphQlFilter($fields);
    }

    /**
     * Transform  children node in GraphQl filter.
     */
    private function processChildrenNode(array $childrenNode): array
    {
        $childrenGraphQlFilters = [];
        foreach ($childrenNode as $childNode) {
            $childrenGraphQlFilters[] = $this->ruleEngineManager->transformRuleNodeToGraphQlFilter($childNode);
        }

        return $childrenGraphQlFilters;
    }

    public function validateRuleData(array $ruleNode): void
    {
        if (!isset($ruleNode['children'])) {
            throw new LogicException('The children node is missing on a combination rule.');
        }

        if (!isset($ruleNode['operator'])) {
            throw new LogicException('The operator is missing in a combination rule.');
        }

        if (!\in_array($ruleNode['operator'], self::OPERATORS, true)) {
            throw new LogicException("The operator '{$ruleNode['operator']}' is not supported in combination rules.");
        }

        if (!isset($ruleNode['value'])) {
            throw new LogicException('The value is missing in a combination rule.');
        }

        if (!\in_array($ruleNode['value'], self::VALUES, true)) {
            throw new LogicException("The value '{$ruleNode['value']}' is not supported in combination rule.");
        }
    }
}
