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

namespace Elasticsuite\Entity\GraphQl\Type\Definition\Filter;

use Elasticsuite\Metadata\Model\SourceField;

class StockTypeDefaultFilterInputType extends BoolTypeFilterInputType
{
    public const SPECIFIC_NAME = 'StockTypeDefaultFilterInputType';

    public $name = self::SPECIFIC_NAME;

    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return SourceField\Type::TYPE_STOCK === $sourceField->getType();
    }

    /**
     * {@inheritDoc}
     */
    public function getFilterFieldName(string $sourceFieldCode): string
    {
        return $sourceFieldCode . '.status';
    }
}
