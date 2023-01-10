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

namespace Gally\Metadata\Model\SourceField;

class Weight
{
    public const WEIGHT_VALUE_1 = 1;
    public const WEIGHT_VALUE_2 = 2;
    public const WEIGHT_VALUE_3 = 3;
    public const WEIGHT_VALUE_4 = 4;
    public const WEIGHT_VALUE_5 = 5;
    public const WEIGHT_VALUE_6 = 6;
    public const WEIGHT_VALUE_7 = 7;
    public const WEIGHT_VALUE_8 = 8;
    public const WEIGHT_VALUE_9 = 9;
    public const WEIGHT_VALUE_10 = 10;

    public const WEIGHT_VALID_VALUES = [
        self::WEIGHT_VALUE_1,
        self::WEIGHT_VALUE_2,
        self::WEIGHT_VALUE_3,
        self::WEIGHT_VALUE_4,
        self::WEIGHT_VALUE_5,
        self::WEIGHT_VALUE_6,
        self::WEIGHT_VALUE_7,
        self::WEIGHT_VALUE_8,
        self::WEIGHT_VALUE_9,
        self::WEIGHT_VALUE_10,
    ];

    public const WEIGHT_VALID_VALUES_OPTIONS = [
        ['label' => '1', 'value' => self::WEIGHT_VALUE_1],
        ['label' => '2', 'value' => self::WEIGHT_VALUE_2],
        ['label' => '3', 'value' => self::WEIGHT_VALUE_3],
        ['label' => '4', 'value' => self::WEIGHT_VALUE_4],
        ['label' => '5', 'value' => self::WEIGHT_VALUE_5],
        ['label' => '6', 'value' => self::WEIGHT_VALUE_6],
        ['label' => '7', 'value' => self::WEIGHT_VALUE_7],
        ['label' => '8', 'value' => self::WEIGHT_VALUE_8],
        ['label' => '9', 'value' => self::WEIGHT_VALUE_9],
        ['label' => '10', 'value' => self::WEIGHT_VALUE_10],
    ];

    /**
     * Get valid weight values.
     *
     * @return int[]
     */
    public static function getValidWeight(): array
    {
        return self::WEIGHT_VALID_VALUES;
    }
}
