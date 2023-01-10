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

namespace Gally\Bundle\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

#[ApiResource(
    itemOperations: [],
    collectionOperations: [
        'get' => ['pagination_enabled' => false],
    ],
    graphql: [
        'collection_query' => ['pagination_enabled' => false],
    ],
)]

class ExtraBundle
{
    public const GALLY_BUNDLE_PREFIX = 'Gally';
    public const GALLY_STANDARD_BUNDLE = 'GallyBundle';

    #[ApiProperty(identifier: true)]
    public string $id;

    public string $name;
}
