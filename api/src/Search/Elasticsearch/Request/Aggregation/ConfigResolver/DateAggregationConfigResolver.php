<?php
/**
 * DISCLAIMER.
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace App\Search\Elasticsearch\Request\Aggregation\ConfigResolver;

use Gally\Configuration\Service\ConfigurationManager;
use Gally\Metadata\Entity\SourceField;
use Gally\Search\Elasticsearch\Request\BucketInterface;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\Aggregation\ConfigResolver\DateAggregationConfigResolver as BaseDateAggregationConfigResolver;

class DateAggregationConfigResolver extends BaseDateAggregationConfigResolver
{
    public function __construct(
        private ConfigurationManager $configurationManager,
        private array $searchConfig,
    ) {
        parent::__construct($configurationManager);
    }

    public function getConfig(ContainerConfigurationInterface $containerConfig, SourceField $sourceField): array
    {
        $ranges = $this->searchConfig['aggregations']['default_date_ranges'];
        array_walk($ranges, function (&$value) {
            unset($value['label']);
        });

        return [
            'name' => $sourceField->getCode(),
            'type' => BucketInterface::TYPE_DATE_RANGE,
            'minDocCount' => 1,
            'format' => $this->configurationManager->getScopedConfigValue('gally.search_settings.default_date_field_format'),
            'ranges' => $ranges,
        ];
    }
}
