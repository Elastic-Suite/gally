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

namespace Gally\Product\GraphQl\Type\Definition\SortOrder;

use Gally\Metadata\Model\SourceField;
use Gally\Metadata\Model\SourceField\Type;

class StockDefaultSortOrderProvider implements SortOrderProviderInterface
{
    public function __construct(protected string $nestingSeparator)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return Type::TYPE_STOCK === $sourceField->getType();
    }

    /**
     * {@inheritDoc}
     */
    public function getSortOrderField(SourceField $sourceField): string
    {
        return str_replace(
            '.',
            $this->nestingSeparator,
            sprintf('%s.%s', $sourceField->getCode(), 'status'),
        );
    }

    /**
     * {@inheritDoc}
     */
    public function getLabel(SourceField $sourceField): string
    {
        return sprintf(
            "Sorting by %s's status (%s)",
            $sourceField->getDefaultLabel(),
            $sourceField->getCode()
        );
    }

    /**
     * {@inheritDoc}
     */
    public function getSimplifiedLabel(SourceField $sourceField): string
    {
        return 'Stock status';
    }
}
