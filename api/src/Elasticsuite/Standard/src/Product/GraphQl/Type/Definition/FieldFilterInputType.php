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

namespace Elasticsuite\Product\GraphQl\Type\Definition;

use Elasticsuite\Entity\GraphQl\Type\Definition\Filter\BoolFilterInputType;
use Elasticsuite\Entity\GraphQl\Type\Definition\Filter\EntityFilterInterface;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\GraphQl\Type\Definition\FieldFilterInputType as BaseFieldFilterInputType;

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
