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

namespace Gally\Entity\Model\Attribute\Type;

use Gally\Entity\Model\Attribute\AttributeInterface;
use Gally\Entity\Model\Attribute\StructuredAttributeInterface;

class StockAttribute extends AbstractStructuredAttribute implements AttributeInterface, StructuredAttributeInterface
{
    public const ATTRIBUTE_TYPE = 'stock';

    /**
     * {@inheritDoc}
     */
    public static function getFields(): array
    {
        // Possible additional fields in the future.
        return [
            'status' => ['class_type' => BooleanAttribute::class],
            'qty' => ['class_type' => FloatAttribute::class],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public static function isList(): bool
    {
        return false;
    }
}
