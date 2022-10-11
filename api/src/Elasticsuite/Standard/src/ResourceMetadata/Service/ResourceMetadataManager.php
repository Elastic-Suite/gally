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

namespace Elasticsuite\ResourceMetadata\Service;

use ApiPlatform\Core\Metadata\Resource\ResourceMetadata;

/**
 *  Allows to manage elasticsuite attributes on ApiResources.
 */
class ResourceMetadataManager
{
    public const RESOURCE_METADATA_PATH_ROOT = 'elasticsuite';

    public function getIndex(ResourceMetadata $resourceMetadata): ?string
    {
        return $this->getResourceMetadataValue($resourceMetadata, 'index');
    }

    public function getMetadataEntity(ResourceMetadata $resourceMetadata): ?string
    {
        return $this->getResourceMetadataValue($resourceMetadata, 'metadata/entity');
    }

    public function getStitchingProperty(ResourceMetadata $resourceMetadata): ?string
    {
        return $this->getResourceMetadataValue($resourceMetadata, 'stitching/property');
    }

    public function getCacheTagResourceClasses(ResourceMetadata $resourceMetadata): ?array
    {
        return $this->getResourceMetadataValue($resourceMetadata, 'cache_tag/resource_classes');
    }

    /**
     * Get resource metadata value.
     *
     * @param ResourceMetadata $resourceMetadata resource metadata
     * @param string           $path             path of the metadata value node to get from elasticsuite node, key levels separated by a '/'
     *                                           (example: stitching/property)
     */
    public function getResourceMetadataValue(ResourceMetadata $resourceMetadata, string $path): mixed
    {
        $path = explode('/', $path);
        $value = $resourceMetadata->getAttribute(self::RESOURCE_METADATA_PATH_ROOT);
        foreach ($path as $key) {
            if (!isset($value[$key])) {
                $value = null;
                break;
            }
            $value = $value[$key];
        }

        return $value;
    }
}
