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

namespace Elasticsuite\Product\GraphQl\Type\Definition\SortOrder;

use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Metadata\Model\SourceField\Type;

class PriceDefaultSortOrderProvider implements SortOrderProviderInterface
{
    public function __construct(protected string $nestingSeparator)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return Type::TYPE_PRICE === $sourceField->getType();
    }

    /**
     * {@inheritDoc}
     */
    public function getSortOrderField(SourceField $sourceField): string
    {
        return str_replace(
            '.',
            $this->nestingSeparator,
            sprintf('%s.%s', $sourceField->getCode(), 'price'),
        );
    }

    /**
     * {@inheritDoc}
     */
    public function getLabel(SourceField $sourceField): string
    {
        return sprintf(
            "Sorting by %s's final price (%s)",
            $sourceField->getDefaultLabel(),
            $sourceField->getCode()
        );
    }

    /**
     * {@inheritDoc}
     */
    public function getSimplifiedLabel(SourceField $sourceField): string
    {
        return 'Final price';
    }
}
