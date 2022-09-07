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

namespace Elasticsuite\Product\GraphQl\Type\Definition\Filter;

use Elasticsuite\GraphQl\Type\Definition\FilterInterface as SearchFilterInterface;
use Elasticsuite\Metadata\Model\SourceField;

interface FilterInterface extends SearchFilterInterface
{
    public function support(SourceField $sourceField): bool;

    public function getGraphQlFieldName(string $mappingFieldName): string;

    public function getMappingFieldName(string $graphqlFieldName): string;
}
