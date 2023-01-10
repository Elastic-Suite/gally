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

namespace Gally\Entity\GraphQl\Type\Definition\Filter;

use Gally\GraphQl\Type\Definition\FilterInterface as SearchFilterInterface;
use Gally\Metadata\Model\SourceField;

interface EntityFilterInterface extends SearchFilterInterface
{
    /**
     * Returns true if the filter input type supports the provided source field.
     *
     * @param SourceField $sourceField Source field
     */
    public function supports(SourceField $sourceField): bool;

    /**
     * Get the Elasticsearch filter field name corresponding to the provided field code.
     *
     * @param string $sourceFieldCode Source field code
     */
    public function getFilterFieldName(string $sourceFieldCode): string;

    /**
     * Get the graphql field name corresponding to the provided mapping filter input field name.
     *
     * @param string $mappingFilterName Mapping filter name
     */
    public function getGraphQlFieldName(string $mappingFilterName): string;

    /**
     * Get the Elasticsearch mapping field name corresponding to the provided graphql filter input field name.
     *
     * @param string $graphqlFieldName GraphQL field name
     */
    public function getMappingFieldName(string $graphqlFieldName): string;
}
