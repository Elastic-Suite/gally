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

    /**
     * Instantiate a new mapping.
     *
     * @param FieldInterface[] $fields list of mapping fields
     */
    public function __construct(array $fields = [])
    {
        $this->fields = $this->prepareFields($fields);
    }

    public function asArray(): array
    {
        return ['properties' => $this->getProperties()];
    }

    public function getProperties(): array
    {
        $properties = [];

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

        $fieldRoot[end($fieldPathArray)] = $property;

        return $properties;
    }
}
