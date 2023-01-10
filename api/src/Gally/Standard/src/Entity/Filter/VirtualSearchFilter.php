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

namespace Gally\Entity\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * Create filter for field that doesn't exist in the entity.
 */
class VirtualSearchFilter extends SearchFilter
{
    /**
     * {@inheritdoc}
     */
    public function getDescription(string $resourceClass): array
    {
        $description = [];
        $properties = $this->getProperties();

        foreach ($properties as $property => $propertyData) {
            $description[$property] = [
                'property' => $property,
                'type' => $propertyData['type'],
                'required' => false,
                'strategy' => $propertyData['strategy'],
            ];
        }

        return $description;
    }
}
