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

use Elasticsuite\Index\Model\Index\Mapping\FieldFilterInterface;
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

    /**
     * Return an array with all searchable mapping properties as key and their weight as the value.
     *
     * @param string|null           $analyzer     search analyzer
     * @param string|null           $defaultField Default field added to the list of fields.
     *                                            All field weighted with 1 will be ignored if present.
     * @param float                 $boost        a multiplier applied to fields default weight
     * @param ?FieldFilterInterface $fieldFilter  a filter applied to fields
     *
     * @return float[]
     */
    public function getWeightedSearchProperties(
        ?string $analyzer = null,
        ?string $defaultField = null,
        float $boost = 1,
        ?FieldFilterInterface $fieldFilter = null
    ): array;
}
