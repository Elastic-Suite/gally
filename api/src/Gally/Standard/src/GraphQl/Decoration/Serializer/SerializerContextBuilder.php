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

namespace Gally\GraphQl\Decoration\Serializer;

use ApiPlatform\Core\GraphQl\Serializer\SerializerContextBuilderInterface;
use Gally\GraphQl\Decoration\Resolver\Stage\ReadStage;

/**
 * Add gally_filters info in serializer context.
 */
class SerializerContextBuilder implements SerializerContextBuilderInterface
{
    public const GRAPHQL_GALLY_FILTERS_KEY = 'gally_filters';

    public function __construct(
        private string $nestingSeparator,
        private SerializerContextBuilderInterface $decorated,
    ) {
    }

    public function create(?string $resourceClass, string $operationName, array $resolverContext, bool $normalization): array
    {
        $context = $this->decorated->create($resourceClass, $operationName, $resolverContext, $normalization);

        if (isset($resolverContext[ReadStage::GRAPHQL_GALLY_ARGS_KEY])) {
            $context[self::GRAPHQL_GALLY_FILTERS_KEY] = $this->getNormalizedFilters($resolverContext[ReadStage::GRAPHQL_GALLY_ARGS_KEY]);
        }

        return $context;
    }

    /**
     * Copy of @see ApiPlatform\Core\GraphQl\Resolver\Stage\ReadStage::getNormalizedFilters
     * In this function  we removed useless code for GraphQl gally args.
     */
    private function getNormalizedFilters(array $args): array
    {
        $filters = $args;

        foreach ($filters as $name => $value) {
            if (\is_array($value)) {
                if (strpos((string) $name, '_list')) {
                    $name = substr($name, 0, \strlen($name) - \strlen('_list'));
                }

                $filters[$name] = $this->getNormalizedFilters($value);
            }

            if (\is_string($name) && strpos($name, $this->nestingSeparator)) {
                // Gives a chance to relations/nested fields.
                $index = array_search($name, array_keys($filters), true);
                $filters =
                    \array_slice($filters, 0, $index + 1) +
                    [str_replace($this->nestingSeparator, '.', $name) => $value] +
                    \array_slice($filters, $index + 1);
            }
        }

        return $filters;
    }
}
