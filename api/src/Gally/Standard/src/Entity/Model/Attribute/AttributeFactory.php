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

namespace Gally\Entity\Model\Attribute;

/**
 * Factory for attribute types.
 */
class AttributeFactory
{
    private array $factories;

    /**
     * Constructor.
     *
     * @param iterable $factories Attribute factories by type
     */
    public function __construct(iterable $factories = [])
    {
        $factories = ($factories instanceof \Traversable) ? iterator_to_array($factories) : $factories;

        $this->factories = $factories;
    }

    /**
     * Create an attribute from its type and params.
     *
     * @param string $attributeType   Attribute type (must be a valid attribute type defined into the factories array)
     * @param array  $attributeParams Attribute constructor params
     */
    public function create(string $attributeType, array $attributeParams = []): AttributeInterface
    {
        if (!isset($this->factories[$attributeType])) {
            throw new \LogicException("No factory found for attribute of type {$attributeType}");
        }

        return $this->factories[$attributeType]->create($attributeParams);
    }
}
