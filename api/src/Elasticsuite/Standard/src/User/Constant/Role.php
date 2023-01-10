<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\User\Constant;

final class Role
{
    public const ROLE_ADMIN = 'ROLE_ADMIN';

    public const ROLE_CONTRIBUTOR = 'ROLE_CONTRIBUTOR';

    public const ROLES = [
        self::ROLE_CONTRIBUTOR,
        self::ROLE_ADMIN,
    ];
}
