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

namespace Gally\Cache\Service;

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
     * @throws \Psr\Cache\InvalidArgumentException
     */
    public function get(string $cacheKey, callable $callback, array $tags, int $ttl = 0): mixed;

    /**
     * Delete item from the cache.
     *
     * @param string $cacheKey Cache key
     *
     * @return bool True if the item was successfully removed. False if there was an error.
     */
    public function delete(string $cacheKey): bool;

    /**
     * Delete items from the cache according to the provided cache tags.
     *
     * @param string[] $tags cache tags
     *
     * @throws InvalidArgumentException When $tags is not valid
     *
     * @return bool True on success
     */
    public function clearTags(array $tags): bool;

    /**
     * Remove all objects from the cache.
     */
    public function clearAll(): bool;

    /**
     * Remove the expired objects from the cache.
     */
    public function prune(): bool;
}
