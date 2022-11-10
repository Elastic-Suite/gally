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

namespace Elasticsuite\GraphQl\Decoration\Type;

use ApiPlatform\Core\GraphQl\Type\FieldsBuilderInterface;
use ApiPlatform\Core\Metadata\Resource\ResourceMetadata;

/**
 * Allows to add dynamically rename graphql queries.
 */
class RenameGraphQlQuery implements FieldsBuilderInterface
{
    public function __construct(
        private array $graphqlQueryRenamings,
        private FieldsBuilderInterface $decorated,
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function getCollectionQueryFields(
        string $resourceClass,
        ResourceMetadata $resourceMetadata,
        string $queryName,
        array $configuration
    ): array {
        $fields = $this->decorated->getCollectionQueryFields($resourceClass, $resourceMetadata, $queryName, $configuration);

        if (\array_key_exists($resourceClass, $this->graphqlQueryRenamings)) {
            foreach ($this->graphqlQueryRenamings[$resourceClass]['renamings'] as $oldName => $newName) {
                if (\array_key_exists($oldName, $fields)) {
                    $fields[$newName] = $fields[$oldName];
                    unset($fields[$oldName]);
                }
            }
        }

        return $fields;
    }

    public function getNodeQueryFields(): array
    {
        return $this->decorated->getNodeQueryFields();
    }

    public function getItemQueryFields(string $resourceClass, ResourceMetadata $resourceMetadata, string $queryName, array $configuration): array
    {
        return $this->decorated->getItemQueryFields($resourceClass, $resourceMetadata, $queryName, $configuration);
    }

    public function getMutationFields(string $resourceClass, ResourceMetadata $resourceMetadata, string $mutationName): array
    {
        return $this->decorated->getMutationFields($resourceClass, $resourceMetadata, $mutationName);
    }

    public function getSubscriptionFields(string $resourceClass, ResourceMetadata $resourceMetadata, string $subscriptionName): array
    {
        return $this->decorated->getSubscriptionFields($resourceClass, $resourceMetadata, $subscriptionName);
    }

    public function getResourceObjectTypeFields(?string $resourceClass, ResourceMetadata $resourceMetadata, bool $input, ?string $queryName, ?string $mutationName, ?string $subscriptionName, int $depth, ?array $ioMetadata): array
    {
        return $this->decorated->getResourceObjectTypeFields($resourceClass, $resourceMetadata, $input, $queryName, $mutationName, $subscriptionName, $depth, $ioMetadata);
    }

    public function resolveResourceArgs(array $args, string $operationName, string $shortName): array
    {
        return $this->decorated->resolveResourceArgs($args, $operationName, $shortName);
    }
}
