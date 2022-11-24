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

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\Modifier;

use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Service\ViewMoreContext;

class ViewMore implements ModifierInterface
{
    public function __construct(
        private ViewMoreContext $viewMoreContext
    ) {
    }

    public function modifyFacetConfigs(
        ContainerConfigurationInterface $containerConfig,
        array $facetConfigs,
        QueryInterface|string|null $query,
        array $filters,
        array $queryFilters
    ): array {
        $relevantSourceFields = $facetConfigs;
        if ($this->getSourceFieldCode()) {
            $sourceFieldCode = $this->getSourceFieldCode();
            $relevantSourceFields = array_filter(
                $relevantSourceFields,
                fn ($facetConfig) => $facetConfig->getSourceFieldCode() === $sourceFieldCode
            );
        }

        return $relevantSourceFields;
    }

    public function modifyAggregations(
        ContainerConfigurationInterface $containerConfig,
        array $aggregations,
        QueryInterface|string|null $query,
        array $filters,
        array $queryFilters
    ): array {
        if ($this->getSourceFieldCode()) {
            if (isset($aggregations[$this->getSourceFieldCode()])) {
                $aggregations[$this->getSourceFieldCode()]['size'] = 0;
            }
        }

        return $aggregations;
    }

    private function getSourceFieldCode(): ?string
    {
        return $this->viewMoreContext->getFilterName();
    }
}
