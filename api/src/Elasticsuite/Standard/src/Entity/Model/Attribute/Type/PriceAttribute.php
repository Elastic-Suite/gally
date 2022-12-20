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
class PriceAttribute extends AbstractStructuredAttribute implements AttributeInterface, StructuredAttributeInterface
{
    public function __construct(
        string $attributeCode,
        mixed $value,
        protected ?string $priceGroupId = null
    ) {
        parent::__construct($attributeCode, $value);
    }

    public function getSanitizedData(mixed $value): mixed
    {
        $value = $this->getPriceForCurrentGroup($value);

        return parent::getSanitizedData($value);
    }

    protected function getPriceForCurrentGroup(mixed $value): mixed
    {
        $priceFound = false;
        if (\is_array($value) && null !== $this->priceGroupId) {
            foreach ($value as $priceData) {
                if (($priceData['group_id'] ?? null) == $this->priceGroupId) {
                    $value = [$priceData];
                    $priceFound = true;
                    break;
                }
            }
        }

        if (!\is_array($value) || null === $this->priceGroupId || !$priceFound) {
            $value = [];
        }

        return $value;
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
}
