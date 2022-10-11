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

/**
 * Used for normalization/de-normalization and graphql schema stitching of price source fields.
 */
class PriceAttribute implements AttributeInterface, StructuredAttributeInterface
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
            // TODO use available context to extract the correct group_id price when the schema expects only one price.
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
        // Will depend from global configuration in the future.
        // (@see \Elasticsuite\Index\Converter\SourceField\PriceSourceFieldConverter)
        return [
            'original_price' => ['class_type' => FloatAttribute::class],
            'price' => ['class_type' => FloatAttribute::class],
            'is_discounted' => ['class_type' => BooleanAttribute::class],
            // TODO mask group_id by default ?
            'group_id' => ['class_type' => TextAttribute::class],
            // 'currency' => ['class_type' => TextAttribute:class],
            // 'is_dynamic' => ['class_type' => BooleanAttribute:class]
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
