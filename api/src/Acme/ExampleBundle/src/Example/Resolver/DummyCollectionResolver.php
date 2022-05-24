<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Acme\Example
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Acme\Example\Example\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;

class DummyCollectionResolver implements QueryCollectionResolverInterface
{
    /**
     * @param iterable<object> $collection
     *
     * @return iterable<object>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        return $collection;
    }
}
