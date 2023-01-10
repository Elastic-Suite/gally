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

namespace Gally\Index\Converter\SourceField;

use Gally\Index\Model\Index\Mapping;
use Gally\Metadata\Model\SourceField;

interface SourceFieldConverterInterface
{
    /**
     * Whether the converter supports the given source field.
     *
     * @param SourceField $sourceField Source field
     */
    public function supports(SourceField $sourceField): bool;

    /**
     * Get the mapping field(d)s associated with the source field if the converter supports it.
     *
     * @param SourceField $sourceField Source field
     *
     * @return Mapping\FieldInterface[]
     */
    public function getFields(SourceField $sourceField): array;
}
