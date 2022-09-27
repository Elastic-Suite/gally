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

namespace Elasticsuite\Entity\Model\Attribute;

/**
 * Structured source field/entity attribute stitching description interface.
 */
interface StructuredAttributeInterface
{
    /**
     * Get the inner fields of a structured source field which will act as inner attributes.
     *
     * @return array An array whose keys are the inner field names and the values their corresponding stitching class
     */
    public static function getFields(): array;
}
