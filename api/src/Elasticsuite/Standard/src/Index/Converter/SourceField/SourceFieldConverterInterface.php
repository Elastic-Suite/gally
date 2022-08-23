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

namespace Elasticsuite\Index\Converter\SourceField;

use Elasticsuite\Index\Model\Index\Mapping;
use Elasticsuite\Metadata\Model\SourceField;

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
