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

namespace Elasticsuite\Product\GraphQl\Type\Definition;

use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\Product\GraphQl\Type\Definition\Filter\BoolFilterInputType;
use Elasticsuite\Product\GraphQl\Type\Definition\Filter\FilterInterface;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\GraphQl\Type\Definition\FieldFilterInputType as BaseFieldFilterInputType;

class FieldFilterInputType extends BaseFieldFilterInputType
{
    public const NAME = 'ProductFieldFilterInput';

    /**
     * @param FilterInterface[] $availableTypes Filter type
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
                if ($type->support($filterableField)) {
                    $fields[$type->getGraphQlFieldName($filterableField->getCode())] = ['type' => $type];
                }
            }
        }

        return ['fields' => $fields];
    }
}
