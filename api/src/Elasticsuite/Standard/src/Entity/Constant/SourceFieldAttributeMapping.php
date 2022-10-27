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

namespace Elasticsuite\Entity\Constant;

use Elasticsuite\Metadata\Model\SourceField\Type as SourceFieldType;

class SourceFieldAttributeMapping
{
    /**
     * @Todo: Move TYPES to config.
     */
    public const TYPES = [
        SourceFieldType::TYPE_TEXT => \Elasticsuite\Entity\Model\Attribute\Type\TextAttribute::class,
        SourceFieldType::TYPE_KEYWORD => \Elasticsuite\Entity\Model\Attribute\Type\TextAttribute::class,
        SourceFieldType::TYPE_SELECT => \Elasticsuite\Entity\Model\Attribute\Type\SelectAttribute::class,
        SourceFieldType::TYPE_INT => \Elasticsuite\Entity\Model\Attribute\Type\IntAttribute::class,
        SourceFieldType::TYPE_BOOLEAN => \Elasticsuite\Entity\Model\Attribute\Type\BooleanAttribute::class,
        SourceFieldType::TYPE_FLOAT => \Elasticsuite\Entity\Model\Attribute\Type\FloatAttribute::class,
        SourceFieldType::TYPE_PRICE => \Elasticsuite\Entity\Model\Attribute\Type\PriceAttribute::class,
        SourceFieldType::TYPE_STOCK => \Elasticsuite\Entity\Model\Attribute\Type\StockAttribute::class,
        SourceFieldType::TYPE_CATEGORY => \Elasticsuite\Entity\Model\Attribute\Type\CategoryAttribute::class,
        SourceFieldType::TYPE_REFERENCE => \Elasticsuite\Entity\Model\Attribute\Type\TextAttribute::class,
        SourceFieldType::TYPE_IMAGE => \Elasticsuite\Entity\Model\Attribute\Type\TextAttribute::class,
        SourceFieldType::TYPE_OBJECT => \Elasticsuite\Entity\Model\Attribute\Type\TextAttribute::class,
        SourceFieldType::TYPE_DATE => \Elasticsuite\Entity\Model\Attribute\Type\TextAttribute::class,
    ];
}
