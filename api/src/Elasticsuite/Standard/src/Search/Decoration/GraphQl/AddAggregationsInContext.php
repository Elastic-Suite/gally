<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Search\Decoration\GraphQl;

use ApiPlatform\Core\GraphQl\Serializer\SerializerContextBuilderInterface;
use Elasticsuite\Search\Model\Document;

/**
 * Add aggregations info in serializer context.
 */
class AddAggregationsInContext implements SerializerContextBuilderInterface
{
    public function __construct(
        private SerializerContextBuilderInterface $decorated,
    ) {
    }

    public function create(?string $resourceClass, string $operationName, array $resolverContext, bool $normalization): array
    {
        $context = $this->decorated->create($resourceClass, $operationName, $resolverContext, $normalization);
        if (Document::class === $resourceClass || is_subclass_of($resourceClass, Document::class)) {
            $context['need_aggregations'] = $resolverContext['info']->getFieldSelection()['aggregations'] ?? false;
        }

        return $context;
    }
}
