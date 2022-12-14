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

namespace Elasticsuite\Index\Service;

use Elasticsuite\Index\Converter\SourceField\SourceFieldConverterInterface;
use Elasticsuite\Index\Model\Index\Mapping;
use Elasticsuite\Index\Model\Index\Mapping\FieldInterface;
use Elasticsuite\Metadata\Model\Metadata;
use Elasticsuite\Metadata\Model\SourceField;

class MetadataManager
{
    /**
     * @param SourceFieldConverterInterface[] $sourceFieldConverters Source field converters
     */
    public function __construct(
        private iterable $sourceFieldConverters = []
    ) {
        $sourceFieldConverters = ($sourceFieldConverters instanceof \Traversable) ? iterator_to_array($sourceFieldConverters) : $sourceFieldConverters;

        $this->sourceFieldConverters = $sourceFieldConverters;
    }

    /**
     * Create elasticsearch index mapping from metadata entity.
     */
    public function getMapping(Metadata $metadata): Mapping
    {
        $fields = [];

        // Dynamic fields
        foreach ($metadata->getSourceFields() as $sourceField) {
            $fields = $this->getFields($sourceField) + $fields;
        }

        return new Mapping($fields);
    }

    /**
     * @return FieldInterface[]
     */
    public function getFields(SourceField $sourceField): array
    {
        $fields = [];
        foreach ($this->sourceFieldConverters as $converter) {
            if ($converter->supports($sourceField)) {
                $fields = $converter->getFields($sourceField) + $fields;
            }
        }

        return $fields;
    }

    public function getMappingStatus(Metadata $metadata): Mapping\Status
    {
        foreach ($metadata->getSourceFields() as $sourceField) {
            if (!$sourceField->getType()) {
                return new Mapping\Status($metadata->getEntity(), Mapping\Status::Red);
            }
        }

        // @Todo Check mapping status in current index to check if it is the latest version.

        return new Mapping\Status($metadata->getEntity(), Mapping\Status::Green);
    }
}
