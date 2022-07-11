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

namespace Elasticsuite\GraphQl\Type\Definition;

use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

interface FilterInterface
{
    /**
     * Transform GraphQl input data to Elasticsuite filter.
     */
    public function transformToElasticsuiteFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig): QueryInterface;

    /**
     * Validate format of input data.
     */
    public function validate(string $argName, mixed $inputData): array;
}
