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
    public const TYPE_CATEGORY = 'category';
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
        self::TYPE_CATEGORY,
        self::TYPE_REFERENCE,
        self::TYPE_IMAGE,
        self::TYPE_OBJECT,
        self::TYPE_DATE,
    ];

    public const COMPLEX_TYPES = [
        self::TYPE_SELECT,
        self::TYPE_PRICE,
        self::TYPE_STOCK,
        self::TYPE_CATEGORY,
    ];

    public const AVAILABLE_TYPES_OPTIONS = [
        ['label' => 'Text', 'value' => self::TYPE_TEXT],
        ['label' => 'Keyword', 'value' => self::TYPE_KEYWORD],
        ['label' => 'Select', 'value' => self::TYPE_SELECT],
        ['label' => 'Int', 'value' => self::TYPE_INT],
        ['label' => 'Boolean', 'value' => self::TYPE_BOOLEAN],
        ['label' => 'Float', 'value' => self::TYPE_FLOAT],
        ['label' => 'Price', 'value' => self::TYPE_PRICE],
        ['label' => 'Stock', 'value' => self::TYPE_STOCK],
        ['label' => 'Category', 'value' => self::TYPE_CATEGORY],
        ['label' => 'Reference', 'value' => self::TYPE_REFERENCE],
        ['label' => 'Image', 'value' => self::TYPE_IMAGE],
        ['label' => 'Object', 'value' => self::TYPE_OBJECT],
        ['label' => 'Date', 'value' => self::TYPE_DATE],
    ];

    public static function getAvailableTypes(): array
    {
        return self::AVAILABLE_TYPES;
    }
}
