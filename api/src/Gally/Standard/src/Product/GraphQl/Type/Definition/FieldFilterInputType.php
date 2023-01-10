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

namespace Gally\Product\GraphQl\Type\Definition;

use Gally\Entity\GraphQl\Type\Definition\Filter\BoolFilterInputType;
use Gally\Entity\GraphQl\Type\Definition\Filter\EntityFilterInterface;
use Gally\Metadata\Repository\SourceFieldRepository;
use Gally\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Gally\Search\GraphQl\Type\Definition\FieldFilterInputType as BaseFieldFilterInputType;

class FieldFilterInputType extends BaseFieldFilterInputType
{
    public const NAME = 'ProductFieldFilterInput';

    /**
     * @param EntityFilterInterface[] $availableTypes Filter type
     */
    public function __construct(
        FilterQueryBuilder $filterQueryBuilder,
        private iterable $availableTypes,
        private BoolFilterInputType $boolFilterInputType,
        private SourceFieldRepository $sourceFieldRepository,
    ) {
        parent::__construct($availableTypes, $filterQueryBuilder);
        $this->name = self::NAME;
    }

    public function getConfig(): array
    {
        $fields = ['boolFilter' => ['type' => $this->boolFilterInputType]];

        foreach ($this->sourceFieldRepository->getFilterableInRequestFields('product') as $filterableField) {
            foreach ($this->availableTypes as $type) {
                if ($type->supports($filterableField)) {
                    $fields[$type->getGraphQlFieldName($type->getFilterFieldName($filterableField->getCode()))] = ['type' => $type];
                }
            }
        }

        return ['fields' => $fields];
    }
}
