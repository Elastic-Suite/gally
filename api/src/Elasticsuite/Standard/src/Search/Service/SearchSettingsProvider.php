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

namespace Elasticsuite\Search\Service;

class SearchSettingsProvider
{
    public function __construct(private array $searchSettings)
    {
    }

    /**
     * If the coverageUseIndexedFieldsProperty config is set to false (default value),
     * we will deduce ourselves the indexed fields based on a (potentially) costly aggregation.
     * If this config is set to true, we will use the "index_fields" field to build this aggregation.
     */
    public function coverageUseIndexedFieldsProperty(): bool
    {
        return $this->searchSettings['aggregations']['coverage_use_indexed_fields_property'];
    }
}
