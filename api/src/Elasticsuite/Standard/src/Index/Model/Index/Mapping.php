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

namespace Elasticsuite\Index\Model\Index;

use Elasticsuite\Index\Model\Index\Mapping\FieldInterface;

/**
 * Default implementation for ES mappings (Smile\ElasticsuiteCore\Api\Index\MappingInterface).
 */
class Mapping implements MappingInterface
{
    /** @var FieldInterface[] */
    private array $fields;

    /** List of default fields and associated analyzers. */
    private array $defaultMappingFields = [
        self::DEFAULT_SEARCH_FIELD => [
            FieldInterface::ANALYZER_STANDARD,
            FieldInterface::ANALYZER_WHITESPACE,
            FieldInterface::ANALYZER_SHINGLE,
        ],
        self::DEFAULT_SPELLING_FIELD => [
            FieldInterface::ANALYZER_STANDARD,
            FieldInterface::ANALYZER_WHITESPACE,
            FieldInterface::ANALYZER_SHINGLE,
            FieldInterface::ANALYZER_PHONETIC,
        ],
    ];

    /** List of target field for copy to by field configuration. */
    private array $copyFieldMap = [
        'isSearchable' => self::DEFAULT_SEARCH_FIELD,
        'isUsedInSpellcheck' => self::DEFAULT_SPELLING_FIELD,
    ];

    /**
     * Instantiate a new mapping.
     *
     * @param FieldInterface[] $fields list of mapping fields
     */
    public function __construct(array $fields = [])
    {
        $this->fields = $this->prepareFields($fields);

        if (!isset($this->fields[self::ID_FIELD])) {
            throw new \InvalidArgumentException(sprintf('Invalid id field %s : field is not declared.', self::ID_FIELD));
        }
    }

    public function asArray(): array
    {
        return ['properties' => $this->getProperties()];
    }

    public function getProperties(): array
    {
        $properties = [];

        foreach ($this->defaultMappingFields as $fieldName => $analyzers) {
            $properties[$fieldName] = $this->getProperty(FieldInterface::FIELD_TYPE_TEXT, $analyzers);
        }

        foreach ($this->getFields() as $currentField) {
            $properties = $this->addField($properties, $currentField);
        }

        return $properties;
    }

    public function getFields(): array
    {
        return $this->fields;
    }

    public function getField($name): FieldInterface
    {
        if (!isset($this->fields[$name])) {
            throw new \LogicException("Field {$name} does not exists in mapping");
        }

        return $this->fields[$name];
    }

    public function getIdField(): FieldInterface
    {
        return $this->getField(self::ID_FIELD);
    }

    /**
     * Prepare the array of fields to be added to the mapping. Mostly re key the array.
     *
     * @param FieldInterface[] $fields fields to be prepared
     *
     * @return FieldInterface[]
     */
    private function prepareFields(array $fields): array
    {
        $preparedFields = [];

        foreach ($fields as $field) {
            $preparedFields[$field->getName()] = $field;
        }

        return $preparedFields;
    }

    /**
     * Append a new properties into a properties list and returned the updated map.
     */
    private function getProperty(string $propertyType, array $analyzers = []): array
    {
        $property = ['type' => $propertyType, 'analyzer' => FieldInterface::ANALYZER_STANDARD];

        foreach ($analyzers as $analyzer) {
            if (FieldInterface::ANALYZER_STANDARD !== $analyzer) {
                $property['fields'][$analyzer] = ['type' => $propertyType, 'analyzer' => $analyzer];
            }
        }

        return $property;
    }

    /**
     * Append a field to a mapping properties list.
     * The field is appended and the new properties list is returned.
     *
     * @TODO clean
     */
    private function addField(array $properties, FieldInterface $field): array
    {
        $fieldName = $field->getName();
        $fieldRoot = &$properties;

        // Read property config from the field.
        $property = $field->getMappingPropertyConfig();

        $fieldPathArray = explode('.', $fieldName);
        $currentPathArray = [];
        $fieldPathSize = \count($fieldPathArray);

        for ($i = 0; $i < $fieldPathSize - 1; ++$i) {
            $currentPathArray[] = $fieldPathArray[$i];
            $currentPath = implode('.', $currentPathArray);

            if ($field->isNested() && $field->getNestedPath() == $currentPath && !isset($fieldRoot[$fieldPathArray[$i]])) {
                $fieldRoot[$fieldPathArray[$i]] = ['type' => FieldInterface::FIELD_TYPE_NESTED, 'properties' => []];
            } elseif (!isset($fieldRoot[$fieldPathArray[$i]])) {
                $fieldRoot[$fieldPathArray[$i]] = ['type' => FieldInterface::FIELD_TYPE_OBJECT, 'properties' => []];
            }

            $fieldRoot = &$fieldRoot[$fieldPathArray[$i]]['properties'];
        }

        /*
         * Retrieving location where the property has to be copied to.
         * Ex : searchable fields are copied to default "search" field.
         */
        $copyToProperties = $this->getFieldCopyToProperties($field);

        if (!empty($copyToProperties)) {
            // For normal fields, copy_to is appended at the property root.
            $copyToRoot = &$property;
            $copyToRoot['copy_to'] = $copyToProperties;
        }

        $fieldRoot[end($fieldPathArray)] = $property;

        return $properties;
    }

    /**
     * Get the list of default fields where the current field must be copied.
     * Example : searchable fields are copied into the default "search" field.
     *
     * @param FieldInterface $field field to be checked
     */
    private function getFieldCopyToProperties(FieldInterface $field): array
    {
        $copyTo = [];
        foreach ($this->copyFieldMap as $method => $targetField) {
            if ($field->{$method}()) {
                $copyTo[] = $targetField;
            }
        }

        return $copyTo;
    }
}
