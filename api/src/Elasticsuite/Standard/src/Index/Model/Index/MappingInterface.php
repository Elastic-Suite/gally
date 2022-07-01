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

namespace Elasticsuite\Index\Model\Index;

use Elasticsuite\Index\Model\Index\Mapping\FieldInterface;

/**
 * Representation of an Elasticsearch type mapping.
 */
interface MappingInterface
{
    public const ID_FIELD = 'id';

    public const DEFAULT_SEARCH_FIELD = 'search';
    public const DEFAULT_SPELLING_FIELD = 'spelling';

    /**
     * List of the properties of the mapping.
     */
    public function getProperties(): array;

    /**
     * List of the fields used to build the mapping.
     *
     * @return FieldInterface[]
     */
    public function getFields(): array;

    /**
     * Return a field of the mapping by name.
     */
    public function getField(string $name): FieldInterface;

    /**
     * Return the mapping as an array you can put into ES through the mapping API.
     */
    public function asArray(): array;

    /**
     * Field used as unique id for the doc.
     */
    public function getIdField(): FieldInterface;
}
