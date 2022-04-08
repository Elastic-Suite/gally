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

use Elasticsuite\Index\Converter\SourceFieldToMappingField;
use Elasticsuite\Index\Model\Index\Mapping;
use Elasticsuite\Index\Model\Metadata;

class IndexManager
{
    /**
     * @param SourceFieldToMappingField $fieldConverter Source field converter
     */
    public function __construct(
        private SourceFieldToMappingField $fieldConverter,
    ) {
    }

    /**
     * Create elasticsearch index mapping from metadata entity.
     */
    public function getMapping(Metadata $metadata): Mapping
    {
        $fields = [];

        // Dynamic fields
        foreach ($metadata->getSourceFields() as $sourceField) {
            $field = $this->fieldConverter->convert($sourceField);
            $fields[$field->getName()] = $field;
        }

        return new Mapping($fields);
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
