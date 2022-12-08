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

use Elasticsuite\Metadata\Model\SourceField;

/**
 * ViewMore context. Used as a singleton to pass filter name to the aggregation modifier.
 */
class ViewMoreContext
{
    private ?string $filterName = null;
    private ?SourceField $sourceField = null;

    public function setFilterName(string $filterName): void
    {
        $this->filterName = $filterName;
    }

    public function getFilterName(): ?string
    {
        return $this->filterName;
    }

    public function setSourceField(?SourceField $sourceField): void
    {
        $this->sourceField = $sourceField;
    }

    public function getSourceField(): ?SourceField
    {
        return $this->sourceField;
    }
}
