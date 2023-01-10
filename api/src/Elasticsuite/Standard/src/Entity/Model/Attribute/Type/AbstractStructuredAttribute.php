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

namespace Elasticsuite\Entity\Model\Attribute\Type;

use Elasticsuite\Entity\Model\Attribute\StructuredAttributeInterface;

abstract class AbstractStructuredAttribute extends AbstractAttribute implements StructuredAttributeInterface
{
    /**
     * {@inheritDoc}
     */
    public static function getFields(): array
    {
        return [];
    }

    /**
     * {@inheritDoc}
     */
    public static function isList(): bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     */
    protected function getSanitizedData(mixed $value): mixed
    {
        if (\is_array($value) && !empty($value)) {
            $hasSingleEntry = \count(array_intersect(array_keys($value), array_keys(static::getFields()))) > 0;
            if ($hasSingleEntry && static::isList()) {
                $value = [$value];
            } elseif (!$hasSingleEntry && (false === static::isList())) {
                $value = current($value);
            }
        }

        return $value;
    }
}
