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

namespace Gally\Search\Elasticsearch\Request\Aggregation\Modifier;

use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use Gally\Search\Service\ViewMoreContext;

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
        if ($this->viewMoreContext->getSourceField()) {
            $sourceFieldCode = $this->viewMoreContext->getSourceField()->getCode();
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
        if ($this->viewMoreContext->getFilterName()) {
            if (isset($aggregations[$this->viewMoreContext->getFilterName()])) {
                $aggregations[$this->viewMoreContext->getFilterName()]['size'] = 0;
            }
        }

        return $aggregations;
    }
}
