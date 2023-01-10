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

namespace Gally\Search\DataProvider;

use ApiPlatform\Core\Bridge\Elasticsearch\Serializer\ItemNormalizer;
use ApiPlatform\Core\DataProvider\PaginatorInterface;
use Gally\Search\Elasticsearch\Adapter\Common\Response\AggregationInterface;
use Gally\Search\Elasticsearch\DocumentInterface;
use Gally\Search\Elasticsearch\Request\SortOrderInterface;
use Gally\Search\Elasticsearch\RequestInterface;
use Gally\Search\Elasticsearch\ResponseInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

class Paginator implements \IteratorAggregate, PaginatorInterface
{
    private array $cachedDenormalizedDocuments = [];

    public function __construct(
        private DenormalizerInterface $denormalizer,
        private RequestInterface $request,
        private ResponseInterface $response,
        private string $resourceClass,
        private int $limit,
        private int $offset,
        private array $denormalizationContext = []
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function count(): int
    {
        return $this->response->count();
    }

    /**
     * {@inheritdoc}
     */
    public function getLastPage(): float
    {
        if (0 >= $this->limit) {
            return 1.;
        }

        return ceil($this->getTotalItems() / $this->limit) ?: 1.;
    }

    /**
     * {@inheritdoc}
     */
    public function getTotalItems(): float
    {
        return (float) $this->response->getTotalItems();
    }

    /**
     * {@inheritdoc}
     */
    public function getCurrentPage(): float
    {
        if (0 >= $this->limit) {
            return 1.;
        }

        return floor($this->offset / $this->limit) + 1.;
    }

    /**
     * {@inheritdoc}
     */
    public function getItemsPerPage(): float
    {
        return (float) $this->limit;
    }

    /**
     * {@inheritdoc}
     */
    public function getIterator(): \Traversable
    {
        $denormalizationContext = array_merge([AbstractNormalizer::ALLOW_EXTRA_ATTRIBUTES => true], $this->denormalizationContext);

        /** @var DocumentInterface $document */
        foreach ($this->response->getIterator() as $document) {
            $cacheKey = null;
            if (!empty($document->getIndex()) && !empty($document->getType()) && !empty($document->getInternalId())) {
                $cacheKey = md5(sprintf('%s_%s_%s', $document->getIndex(), $document->getType(), $document->getInternalId()));
            }

            if ($cacheKey && \array_key_exists($cacheKey, $this->cachedDenormalizedDocuments)) {
                $object = $this->cachedDenormalizedDocuments[$cacheKey];
            } else {
                $object = $this->denormalizer->denormalize(
                    $document,
                    $this->resourceClass,
                    ItemNormalizer::FORMAT,
                    $denormalizationContext
                );

                if ($cacheKey) {
                    $this->cachedDenormalizedDocuments[$cacheKey] = $object;
                }
            }

            yield $object;
        }
    }

    /**
     * Get aggregations.
     *
     * @return AggregationInterface[]
     */
    public function getAggregations(): array
    {
        return $this->response->getAggregations();
    }

    /**
     * Get applied sort orders.
     *
     * @return SortOrderInterface[]
     */
    public function getCurrentSortOrders(): array
    {
        return $this->request->getSortOrders();
    }
}
