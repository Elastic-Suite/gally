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

namespace Elasticsuite\Entity\Model\Attribute\Type;

use Elasticsuite\Entity\Model\Attribute\AttributeInterface;
use Elasticsuite\Entity\Model\Attribute\StructuredAttributeInterface;

class CategoryAttribute implements AttributeInterface, StructuredAttributeInterface
{
    protected string $attributeCode;

    protected mixed $value;

    public function __construct($attributeCode, $value)
    {
        $this->attributeCode = $attributeCode;
        $this->value = $value;
    }

    /**
     * {@inheritDoc}
     */
    public function getAttributeCode(): string
    {
        return $this->attributeCode;
    }

    /**
     * {@inheritDoc}
     */
    public function getValue(): mixed
    {
        if (\is_array($this->value)) {
            $value = $this->value;

            $hasSingleEntry = \count(array_intersect(array_keys($this->value), array_keys(self::getFields()))) > 0;
            if ($hasSingleEntry && self::isList()) {
                $value = [$value];
            } elseif (!$hasSingleEntry && (false === self::isList())) {
                $value = current($value);
            }

            return $value;
        }

        return $this->value;
    }

    /**
     * {@inheritDoc}
     */
    public static function getFields(): array
    {
        return [
            'id' => ['class_type' => TextAttribute::class],
            'uid' => ['class_type' => TextAttribute::class],
            'name' => ['class_type' => TextAttribute::class],
            'is_parent' => ['class_type' => BooleanAttribute::class],
            'is_virtual' => ['class_type' => BooleanAttribute::class],
            'is_blacklisted' => ['class_type' => BooleanAttribute::class],
            'position' => ['class_type' => IntAttribute::class],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public static function isList(): bool
    {
        return true;
    }
}
