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

namespace Elasticsuite\Product\Elasticsearch\Request\Aggregation\Modifier;

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Metadata\Model\Metadata;
use Elasticsuite\Product\Elasticsearch\Request\Aggregation\CoverageProvider;
use Elasticsuite\Product\Service\CurrentCategoryProvider;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SimpleRequestBuilder;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Modifier\ModifierInterface;
use Elasticsuite\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Model\Facet\Configuration;
use Elasticsuite\Search\Repository\Facet\ConfigurationRepository;

/**
 * Coverage Modifier for filterable product source field provider.
 */
class Coverage implements ModifierInterface
{
    public function __construct(
        private SimpleRequestBuilder $coverageRequestBuilder,
        private CoverageProvider $coverageProvider,
        private ContainerConfigurationProvider $containerConfigurationProvider,
        private ConfigurationRepository $facetConfigRepository,
        private CurrentCategoryProvider $currentCategoryProvider,
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function modifySourceFields(
        Metadata $metadata,
        LocalizedCatalog $localizedCatalog,
        array $sourceFields,
        QueryInterface|string|null $query,
        array $filters,
        array $queryFilters
    ): array {
        $relevantAttributes = [];
        $coverageRates = $this->getCoverageRates($metadata, $localizedCatalog, $query, $filters, $queryFilters);
        $currentCategory = $this->currentCategoryProvider->getCurrentCategory();
        $this->facetConfigRepository->setCategoryId($currentCategory?->getId());
        $facetConfigs = $this->facetConfigRepository->getConfigurationForSourceFields($sourceFields);

        foreach ($facetConfigs as $facetConfig) {
            $sourceFieldCode = $facetConfig->getSourceField()->getCode();
            $minCoverageRate = $facetConfig->getCoverageRate();

            $isRelevant = isset($coverageRates[$sourceFieldCode]) && ($coverageRates[$sourceFieldCode] >= $minCoverageRate);
            $forceDisplay = Configuration::DISPLAY_MODE_ALWAYS_DISPLAYED == $facetConfig->getDisplayMode();
            $isHidden = Configuration::DISPLAY_MODE_ALWAYS_HIDDEN == $facetConfig->getDisplayMode();

            if (!($isHidden || !($isRelevant || $forceDisplay))) {
                $relevantAttributes[] = $facetConfig->getSourceField();
            }
        }

        return $relevantAttributes;
    }

    /**
     * {@inheritdoc}
     */
    public function modifyAggregations(
        Metadata $metadata,
        LocalizedCatalog $localizedCatalog,
        array $aggregations,
        QueryInterface|string|null $query,
        array $filters,
        array $queryFilters
    ): array {
        return $aggregations;
    }

    /**
     * Get coverage rate of attributes for current search request.
     *
     * @param Metadata                   $metadata         metadata
     * @param LocalizedCatalog           $localizedCatalog the localized catalog
     * @param QueryInterface|string|null $query            Current Query
     * @param array                      $filters          search request filters
     * @param QueryInterface[]           $queryFilters     search request filters prebuilt as QueryInterface
     */
    private function getCoverageRates(
        Metadata $metadata,
        LocalizedCatalog $localizedCatalog,
        QueryInterface|string|null $query = null,
        array $filters = [],
        array $queryFilters = []
    ): array {
        $containerConfig = $this->containerConfigurationProvider->get(
            $metadata,
            $localizedCatalog,
            'product_coverage_rate'
        );

        $coverageRequest = $this->coverageRequestBuilder->create(
            $containerConfig,
            0,
            0,
            $query,
            [],
            $filters,
            $queryFilters
        );

        $coverage = $this->coverageProvider->getCoverage($coverageRequest);
        $coverageRates = [];
        $totalCount = $coverage->getSize() ?: 1;

        foreach ($coverage->getProductCountByAttributeCode() as $attributeCode => $productCount) {
            $coverageRates[$attributeCode] = $productCount / $totalCount * 100;
        }

        return $coverageRates;
    }
}
