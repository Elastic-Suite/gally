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
 * Attribute hydration interface for dynamic attributes.
 */
interface AttributeInterface
{
    /**
     * Get the attribute identifier under which the attribute value will be stored in the entity dynamic attributes.
     */
    public function getAttributeCode(): string;

    /**
     * Get the attribute value to store when hydrating the entity.
     */
    public function getValue(): mixed;
}
