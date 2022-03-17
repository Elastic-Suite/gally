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
    public function __construct(
        private SourceFieldToMappingField $fieldConverter,
        private array $entitiesConfiguration
    ) {
    }

    /**
     * Create elasticsearch index mapping from metadata entity.
     */
    public function getMapping(Metadata $metadata): Mapping
    {
        $fields = [];
        $staticFields = \array_key_exists($metadata->getEntity(), $this->entitiesConfiguration)
            ? ($this->entitiesConfiguration[$metadata->getEntity()]['static_fields'] ?? [])
            : [];

        // Static fields
        // @see elasticsuite.yaml files
        foreach ($staticFields as $fieldData) {
            $path = explode('.', $fieldData['name']);
            unset($path[\count($path) - 1]);
            $field = new Mapping\Field(
                $fieldData['name'],
                $fieldData['type'] ?? Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
                \count($path) ? implode('.', $path) : null
            );
            $fields[$field->getName()] = $field;
        }

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
                return Mapping\Status::Red;
            }
        }

        // @Todo Check mapping status in current index to check if it is the latest version.

        return Mapping\Status::Green;
    }
}
