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

namespace Elasticsuite\Entity\Filter;

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
