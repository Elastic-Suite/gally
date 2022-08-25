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

namespace Elasticsuite\Index\Model\Index\Mapping;

/**
 * An interface that allowed to specify a field filter.
 */
interface FieldFilterInterface
{
    /**
     * Indicates if the field has to be added to the list or not.
     *
     * @param FieldInterface $field field to be tested
     */
    public function filterField(FieldInterface $field): bool;
}
