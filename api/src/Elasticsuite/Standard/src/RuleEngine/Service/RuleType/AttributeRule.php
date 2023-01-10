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

use Elasticsuite\Entity\GraphQl\Type\Definition\Filter\AbstractFilter;
use Elasticsuite\Entity\GraphQl\Type\Definition\Filter\BoolFilterInputType;
use Elasticsuite\Entity\GraphQl\Type\Definition\Filter\EntityFilterInterface;
use Elasticsuite\Exception\LogicException;
use Elasticsuite\Metadata\Model\Metadata;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Metadata\Model\SourceField\Type;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\RuleEngine\GraphQl\Type\Definition\RuleFilterInterface;
use Elasticsuite\Search\Constant\FilterOperator;

class AttributeRule extends AbstractRuleType implements RuleTypeInterface
{
    public const RULE_TYPE = 'attribute';

    public const LABELS_OPERATORS = [
        FilterOperator::EQ => 'is',
        FilterOperator::NOT_EQ => 'is not',
        FilterOperator::GTE => 'equals or greater than',
        FilterOperator::LTE => 'equals or less than',
        FilterOperator::GT => 'greater than',
        FilterOperator::LT => 'less than',
        FilterOperator::MATCH => 'contains',
        FilterOperator::NOT_MATCH => 'does not contain',
        FilterOperator::IN => 'is one of',
        FilterOperator::NOT_IN => 'is not one of',
        FilterOperator::EXIST => 'is defined',
    ];

    public const TEXT_OPERATORS = [
        FilterOperator::EQ,
        FilterOperator::NOT_EQ,
        FilterOperator::MATCH,
        FilterOperator::NOT_MATCH,
        FilterOperator::IN,
        FilterOperator::NOT_IN,
    ];

    public const NUMERIC_OPERATORS = [
        FilterOperator::EQ,
        FilterOperator::NOT_EQ,
        FilterOperator::GT,
        FilterOperator::GTE,
        FilterOperator::LT,
        FilterOperator::LTE,
        FilterOperator::IN,
        FilterOperator::NOT_IN,
    ];

    public const RULE_OPERATORS_BY_TYPE = [
        TYPE::TYPE_TEXT => self::TEXT_OPERATORS,
        TYPE::TYPE_REFERENCE => self::TEXT_OPERATORS,
        TYPE::TYPE_KEYWORD => self::TEXT_OPERATORS,
        TYPE::TYPE_INT => self::NUMERIC_OPERATORS,
        TYPE::TYPE_FLOAT => self::NUMERIC_OPERATORS,
        TYPE::TYPE_BOOLEAN => [FilterOperator::EQ],
        TYPE::TYPE_DATE => [FilterOperator::EQ, FilterOperator::NOT_EQ, FilterOperator::GT, FilterOperator::GTE, FilterOperator::LT, FilterOperator::LTE],
        TYPE::TYPE_SELECT => [FilterOperator::EQ, FilterOperator::NOT_EQ, FilterOperator::IN, FilterOperator::NOT_IN],
        Type::TYPE_CATEGORY => [FilterOperator::EQ, FilterOperator::NOT_EQ],
        Type::TYPE_PRICE => self::NUMERIC_OPERATORS,
        Type::TYPE_STOCK => [FilterOperator::EQ],
    ];

    private ?Metadata $productMetadata = null;

    /**
     * @var SourceField[]
     */
    private array $sourceFields = [];

    public function __construct(
        private BoolFilterInputType $boolFilterInputType,
        private SourceFieldRepository $sourceFieldRepository,
        private MetadataRepository $metadataRepository,
        private iterable $filterTypes,
    ) {
    }

    public function getOperators(): array
    {
        return self::LABELS_OPERATORS;
    }

    public function getOperatorsBySourceFiledType(): array
    {
        return self::RULE_OPERATORS_BY_TYPE;
    }

    public function getValueTypeByOperators(): array
    {
        $types = [];
        $sourceField = new SourceField();
        foreach (array_keys(self::RULE_OPERATORS_BY_TYPE) as $sourceFieldType) {
            $sourceField->setType($sourceFieldType);
            $filterType = $this->getFilterType($sourceField);
            foreach (self::RULE_OPERATORS_BY_TYPE[$sourceFieldType] as $fieldName) {
                /** @var AbstractFilter $filterType */
                $field = $filterType->getField(str_replace(FilterOperator::NOT_PREFIX, '', $fieldName));
                $types[$sourceFieldType][$fieldName] = $field->getType()->toString();
            }
        }

        return $types;
    }

    public function transformRuleNodeToGraphQlFilter(array $ruleNode): array
    {
        if (!isset($ruleNode['field'])) {
            throw new LogicException("The field 'field' is missing in an attribute rule.");
        }

        if (null === $this->productMetadata) {
            $this->productMetadata = $this->metadataRepository->findOneBy(['entity' => 'product']);
        }

        if (!isset($this->sourceFields[$ruleNode['field']])) {
            $this->sourceFields[$ruleNode['field']] = $this->sourceFieldRepository->findOneBy(
                [
                    'metadata' => $this->productMetadata,
                    'code' => $ruleNode['field'],
                ]
            );
        }
        $sourceField = $this->sourceFields[$ruleNode['field']];

        $this->validateAttributeRuleData($sourceField, $ruleNode);

        $operator = $ruleNode['operator'];
        if (str_contains($operator, FilterOperator::NOT_PREFIX)) {
            $operator = str_replace(FilterOperator::NOT_PREFIX, '', $operator);
            $graphQlFilter = $this->boolFilterInputType->getGraphQlFilter([
                '_not' => $this->getFilterType($sourceField)->getGraphQlFilterAsArray($sourceField, [$operator => $ruleNode['value']]),
            ]);
        } else {
            $graphQlFilter = $this->getFilterType($sourceField)->getGraphQlFilterAsArray($sourceField, [$operator => $ruleNode['value']]);
        }

        return $graphQlFilter;
    }

    public function validateAttributeRuleData(?SourceField $sourceField, array $ruleNode): void
    {
        if (!$sourceField instanceof SourceField) {
            throw new LogicException("The source field '{$ruleNode['field']}' does not exist.");
        }

        if (!$sourceField->getIsUsedForRules() && !$sourceField->getIsFilterable()) {
            throw new LogicException("The source field '{$ruleNode['field']}' is not configured to be used in rule engine.");
        }

        $this->validateAttributeType($ruleNode, $sourceField);
        $this->validateOperator($ruleNode);
        $this->validateValueType($ruleNode, $sourceField);
    }

    public function validateAttributeType(array $ruleNode, SourceField $sourceField): void
    {
        if (!isset($ruleNode['attribute_type'])) {
            throw new LogicException('The attribute_type is missing in an attribute rule.');
        }

        if (!\in_array($ruleNode['attribute_type'], array_keys($this->getOperatorsBySourceFiledType()), true)) {
            throw new LogicException("The attribute type '{$ruleNode['attribute_type']}' is not supported in rule engine.");
        }

        if ($ruleNode['attribute_type'] !== $sourceField->getType()) {
            throw new LogicException("The Attribute '{$ruleNode['field']}' should be type '{$sourceField->getType()}' but type '{$ruleNode['attribute_type']}' received in the JSON rule.");
        }
    }

    public function validateOperator(array $ruleNode): void
    {
        if (!isset($ruleNode['operator'])) {
            throw new LogicException('Operator is missing in an attribute rule.');
        }

        if (!\in_array($ruleNode['operator'], $this->getOperatorsBySourceFiledType()[$ruleNode['attribute_type']], true)) {
            throw new LogicException("The operator '{$ruleNode['operator']}' is not supported for the attribute type '{$ruleNode['attribute_type']}'.");
        }
    }

    public function validateValueType(array $ruleNode, SourceField $sourceField): void
    {
        if (!isset($ruleNode['value'])) {
            throw new LogicException("The field 'value' is missing in an attribute rule.");
        }

        $this->getFilterType($sourceField)->validateValueType($ruleNode['field'], $ruleNode['operator'], $ruleNode['value']);
    }

    private function getFilterType(SourceField $sourceField): RuleFilterInterface
    {
        /** @var EntityFilterInterface $filterType */
        foreach ($this->filterTypes as $filterType) {
            if ($filterType->supports($sourceField) && $filterType instanceof RuleFilterInterface) {
                return $filterType;
            }
        }

        throw new LogicException("The attribute type '{$sourceField->getType()}' is not supported in rule engine.");
    }
}
