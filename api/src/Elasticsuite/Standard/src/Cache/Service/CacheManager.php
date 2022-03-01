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

use ApiPlatform\Core\HttpCache\PurgerInterface as HttpPurgerInterface;
use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\Cache\CacheItem;
use Symfony\Component\Cache\PruneableInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

class CacheManager implements CacheManagerInterface
{
    public function __construct(private CacheInterface $pool, private ?HttpPurgerInterface $httpPurger)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function get(string $cacheKey, callable $callback, array $tags, $ttl = null): mixed
    {
        $callback = function (CacheItem $item, bool &$save) use ($callback, $tags, $ttl) {
            $value = $callback($tags, $ttl);
            $item->set($value);
            if (!empty($ttl)) {
                $item->expiresAfter($ttl);
            }
            if (!empty($tags)) {
                $item->tag($tags);
            }

            return $value;
        };

        return $this->pool->get($cacheKey, $callback);
    }

    /**
     * {@inheritDoc}
     */
    public function delete(string $cacheKey): bool
    {
        return $this->pool->deleteItem($cacheKey);
    }

    /**
     * {@inheritDoc}
     */
    public function clearTags(array $tags): bool
    {
        if ($this->pool instanceof TagAwareCacheInterface) {
            if ($this->pool->invalidateTags($tags)) {
                $this->httpPurger?->purge($tags);

                return true;
            }
        }

        return false;
    }

    /**
     * {@inheritDoc}
     */
    public function clearAll(): bool
    {
        if ($this->pool instanceof CacheItemPoolInterface) {
            return $this->pool->clear();
        }

        return false;
    }

    /**
     * {@inheritDoc}
     */
    public function prune(): bool
    {
        if ($this->pool instanceof PruneableInterface) {
            return $this->pool->prune();
        }

        return false;
    }
}
