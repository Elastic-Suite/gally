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

namespace Elasticsuite\GraphQl\Decoration\Resolver\Stage;

use ApiPlatform\Core\GraphQl\Resolver\Stage\ReadStageInterface;
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use ApiPlatform\Core\Util\ArrayTrait;

/**
 * Some elasticsuite args do not fit with the way where API Platform manage graphql args.
 * For example this kind of args is authorized by graphql but not by API Platform:
 * {
 *   searchDocuments(
 *     filter: {{firstFilter: value, secondFilter: value}}
 *   )
 *   {...}
 * }
 * Complete explanation @see https://github.com/api-platform/core/pull/3468.
 *
 * As we need this syntax for some args in our GraphQL queries, we added a mechanism to split args in two categories:
 * - API Platform args: They are managed natively by API Platform, nothing changes (they stay in the array key 'args').
 * - Elasticsuite args: They moved to the array key 'elasticsuite_args', and are treated by the elasticsuite code.
 *
 * To make an 'arg' as an "Elasticsuite arg", you have to set is_elasticsuite_arg to true in the ApiResource attribute, @see \Elasticsuite\Search\Model\Document.
 */
class ReadStage implements ReadStageInterface
{
    use ArrayTrait;

    public const IS_GRAPHQL_ELASTICSUITE_ARG_KEY = 'is_elasticsuite_arg';

    public const GRAPHQL_ELASTICSUITE_ARGS_KEY = 'elasticsuite_args';

    public function __construct(
        private ResourceMetadataFactoryInterface $resourceMetadataFactory,
        private ReadStageInterface $decorated,
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function __invoke(?string $resourceClass, ?string $rootClass, string $operationName, array $context)
    {
        /**
         * Move elastisuite args in a dedicated array key.
         */
        $resourceMetadata = $resourceClass ? $this->resourceMetadataFactory->create($resourceClass) : null;
        if ($resourceMetadata) {
            $args = $resourceMetadata->getGraphqlAttribute($operationName, 'args', [], false);
            foreach ($args as $argName => $arg) {
                if (null !== ($arg[self::IS_GRAPHQL_ELASTICSUITE_ARG_KEY] ?? null) && isset($context['args'][$argName])) {
                    $context[self::GRAPHQL_ELASTICSUITE_ARGS_KEY][$argName] = $context['args'][$argName];
                    unset($context['args'][$argName]);
                }
            }
        }

        return $this->decorated->__invoke($resourceClass, $rootClass, $operationName, $context);
    }
}
