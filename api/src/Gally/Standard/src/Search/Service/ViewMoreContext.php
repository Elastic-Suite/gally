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

namespace Gally\Search\Service;

use Gally\Metadata\Model\SourceField;

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
