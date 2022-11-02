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

class MultiSelectAttribute extends AbstractStructuredAttribute implements AttributeInterface, StructuredAttributeInterface
{
    /**
     * {@inheritDoc}
     */
    public static function getFields(): array
    {
        return [
            'label' => ['class_type' => TextAttribute::class],
            'value' => ['class_type' => TextAttribute::class],
        ];
    }
}
