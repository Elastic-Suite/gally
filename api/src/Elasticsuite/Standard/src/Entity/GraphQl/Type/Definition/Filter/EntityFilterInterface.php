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

namespace Elasticsuite\Entity\GraphQl\Type\Definition\Filter;

use Elasticsuite\GraphQl\Type\Definition\FilterInterface as SearchFilterInterface;
use Elasticsuite\Metadata\Model\SourceField;

interface EntityFilterInterface extends SearchFilterInterface
{
    /**
     * Returns true if the filter input type supports the provided source field.
     *
     * @param SourceField $sourceField Source field
     */
    public function supports(SourceField $sourceField): bool;

    /**
     * Get the filter input graphql field name corresponding to the source field identified by its code.
     *
     * @param string $sourceFieldCode Source field code
     */
    public function getGraphQlFieldName(string $sourceFieldCode): string;

    /**
     * Get the Elasticsearch mapping field name corresponding to the provided graphql filter input field name.
     *
     * @param string $graphqlFieldName GraphQL field name
     */
    public function getMappingFieldName(string $graphqlFieldName): string;
}
