<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @category  Elasticsuite
 * @package   Elasticsuite\Cache
 * @author    Richard Bayet <richard.bayet@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

namespace Elasticsuite\Cache\Service;

use Psr\Cache\InvalidArgumentException;

interface CacheManagerInterface
{
    /**
     * Get item from the cache or calls the callback method to generate its value.
     *
     * @param string   $cacheKey Cache key
     * @param callable $callback Callback method generating the value, providing tags and ttl as parameter
     * @param string[] $tags     Optional cache tags
     * @param int      $ttl      TTL in second, null if no expiry
     *
     * @return mixed
     *
     * @throws \Psr\Cache\InvalidArgumentException
     */
    public function get(string $cacheKey, callable $callback, array $tags, int $ttl = 0): mixed;

    /**
     * Delete item from the cache
     *
     * @param string $cacheKey Cache key
     *
     * @return bool True if the item was successfully removed. False if there was an error.
     */
    public function delete(string $cacheKey): bool;

    /**
     * Delete items from the cache according to the provided cache tags.
     *
     * @param string[] $tags Cache tags.
     *
     * @return bool True on success
     * @throws InvalidArgumentException When $tags is not valid
     */
    public function clearTags(array $tags): bool;

    /**
     * Remove all objects from the cache.
     *
     * @return bool
     */
    public function clearAll(): bool;

    /**
     * Remove the expired objects from the cache.
     *
     * @return bool
     */
    public function prune(): bool;
}
