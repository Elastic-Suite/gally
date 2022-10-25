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

namespace Elasticsuite\Product\GraphQl\Type\Definition\Filter;

use Elasticsuite\Metadata\Model\SourceField;

class PriceTypeDefaultFilterInputType extends FloatTypeFilterInputType
{
    public const SPECIFIC_NAME = 'PriceTypeDefaultFilterInputType';

    public $name = self::SPECIFIC_NAME;

    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return SourceField\Type::TYPE_PRICE === $sourceField->getType();
    }

    /**
     * {@inheritDoc}
     */
    public function getGraphQlFieldName(string $sourceFieldCode): string
    {
        /*
         * No complementarity between getGraphQlFieldName and getMappingFieldName for complex types.
         * getGraphQlFieldName(A) != getGraphQlFieldName(getMappingFieldName(getGraphQlFieldName(A))
         */
        return str_replace('.', $this->nestingSeparator, $sourceFieldCode . '.price');
    }
}
