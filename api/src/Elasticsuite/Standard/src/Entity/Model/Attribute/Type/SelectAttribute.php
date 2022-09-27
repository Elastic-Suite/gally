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
 * Used for normalization/de-normalization and graphql schema stitching of select boolean source fields.
 */
class SelectAttribute implements AttributeInterface, StructuredAttributeInterface
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
        return $this->value;
    }

    /**
     * {@inheritDoc}
     */
    public static function getFields(): array
    {
        return [
            'label' => ['class_type' => \Elasticsuite\Entity\Model\Attribute\Type\TextAttribute::class],
            'value' => ['class_type' => \Elasticsuite\Entity\Model\Attribute\Type\TextAttribute::class],
        ];
    }
}
