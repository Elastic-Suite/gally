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

namespace Elasticsuite\Metadata\Model\SourceField;

class Type
{
    public const TYPE_TEXT = 'text';
    public const TYPE_KEYWORD = 'keyword';
    public const TYPE_SELECT = 'select';
    public const TYPE_INT = 'int';
    public const TYPE_BOOLEAN = 'boolean';
    public const TYPE_FLOAT = 'float';
    public const TYPE_PRICE = 'price';
    public const TYPE_STOCK = 'stock';
    public const TYPE_REFERENCE = 'reference';
    public const TYPE_IMAGE = 'image';
    public const TYPE_OBJECT = 'object';
    public const TYPE_DATE = 'date';

    public const AVAILABLE_TYPES = [
        self::TYPE_TEXT,
        self::TYPE_KEYWORD,
        self::TYPE_SELECT,
        self::TYPE_INT,
        self::TYPE_BOOLEAN,
        self::TYPE_FLOAT,
        self::TYPE_PRICE,
        self::TYPE_STOCK,
        self::TYPE_REFERENCE,
        self::TYPE_IMAGE,
        self::TYPE_OBJECT,
        self::TYPE_DATE,
    ];

    public static function getAvailableTypes(): array
    {
        return self::AVAILABLE_TYPES;
    }
}
