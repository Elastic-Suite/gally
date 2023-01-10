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

namespace Gally\Entity\Model\Attribute;

/**
 * GraphQL schema dynamic attributes stitching interface for scalar attributes.
 */
interface GraphQlAttributeInterface
{
    /**
     * Return the GraphQL type to use to represent the scalar attribute.
     */
    public static function getGraphQlType(): mixed;
}
