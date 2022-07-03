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

namespace Elasticsuite\Analysis\Tests\Unit;

use Elasticsuite\Cache\Service\CacheManagerInterface;

/**
 * Fake cache manager used in unit test.
 */
class CacheManagerMock implements CacheManagerInterface
{
    public function __construct()
    {
    }

    /**
     * {@inheritDoc}
     */
    public function get(string $cacheKey, callable $callback, array $tags, $ttl = null): mixed
    {
        return $callback($tags, $ttl);
    }

    /**
     * {@inheritDoc}
     */
    public function delete(string $cacheKey): bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     */
    public function clearTags(array $tags): bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     */
    public function clearAll(): bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     */
    public function prune(): bool
    {
        return true;
    }
}
