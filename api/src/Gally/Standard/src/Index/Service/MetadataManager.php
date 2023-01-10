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

namespace Gally\Index\Service;

use Gally\Index\Converter\SourceField\SourceFieldConverterInterface;
use Gally\Index\Model\Index\Mapping;
use Gally\Index\Model\Index\Mapping\FieldInterface;
use Gally\Metadata\Model\Metadata;
use Gally\Metadata\Model\SourceField;

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
