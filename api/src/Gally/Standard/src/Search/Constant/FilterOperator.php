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

namespace Gally\Search\Constant;

final class FilterOperator
{
    public const EQ = 'eq';
    public const NOT_EQ = self::NOT_PREFIX . 'eq';
    public const GTE = 'gte';
    public const LTE = 'lte';
    public const GT = 'gt';
    public const LT = 'lt';
    public const MATCH = 'match';
    public const NOT_MATCH = self::NOT_PREFIX . 'match';
    public const IN = 'in';
    public const NOT_IN = self::NOT_PREFIX . 'in';
    public const EXIST = 'exist';

    public const NOT_PREFIX = '!';
}
