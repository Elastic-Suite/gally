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

namespace Gally\Search\Decoration\GraphQl;

use ApiPlatform\Core\GraphQl\Type\TypeBuilderInterface;
use ApiPlatform\Core\GraphQl\Type\TypeNotFoundException;
use ApiPlatform\Core\GraphQl\Type\TypesContainerInterface;
use ApiPlatform\Core\Metadata\Resource\ResourceMetadata;
use Gally\Search\Model\Document;
use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type as GraphQLType;
use Symfony\Component\PropertyInfo\Type;

/**
 * Add aggregations in graphql search document response type.
 */
class AddAggregationsType implements TypeBuilderInterface
{
    public function __construct(
        private TypesContainerInterface $typesContainer,
        private TypeBuilderInterface $decorated,
    ) {
    }

    public function getResourcePaginatedCollectionType(GraphQLType $resourceType, string $resourceClass, string $operationName): GraphQLType
    {
        $type = $this->decorated->getResourcePaginatedCollectionType($resourceType, $resourceClass, $operationName);
        if (Document::class === $resourceClass || is_subclass_of($resourceClass, Document::class)) {
            $fields = $type->getFields(); // @phpstan-ignore-line
            $fields['aggregations'] = $this->getAggregationsType($resourceType);
            $configuration = [
                'name' => $type->name,
                'description' => "Connection for {$type->name}.",
                'fields' => $fields,
            ];

            $type = new ObjectType($configuration);
            $this->typesContainer->set($type->name, $type);
        }

        return $type;
    }

    public function getResourceObjectType(?string $resourceClass, ResourceMetadata $resourceMetadata, bool $input, ?string $queryName, ?string $mutationName, ?string $subscriptionName, bool $wrapped, int $depth): GraphQLType
    {
        return $this->decorated->getResourceObjectType($resourceClass, $resourceMetadata, $input, $queryName, $mutationName, $subscriptionName, $wrapped, $depth);
    }

    public function getNodeInterface(): InterfaceType
    {
        return $this->decorated->getNodeInterface();
    }

    public function isCollection(Type $type): bool
    {
        return $this->decorated->isCollection($type);
    }

    private function getAggregationsType(GraphQLType $resourceType): GraphQLType
    {
        try {
            $aggregationOptionType = $this->typesContainer->get('AggregationOption'); // @phpstan-ignore-line
        } catch (TypeNotFoundException) {
            $aggregationOptionType = new ObjectType(
                [
                    'name' => 'AggregationOption',
                    'fields' => [
                        'count' => GraphQLType::int(),
                        'label' => GraphQLType::string(),
                        'value' => GraphQLType::nonNull(GraphQLType::string()),
                    ],
                ]
            );
            $this->typesContainer->set('AggregationOption', $aggregationOptionType);
        }

        try {
            $aggregationType = $this->typesContainer->get('Aggregation'); // @phpstan-ignore-line
        } catch (TypeNotFoundException) {
            $aggregationType = new ObjectType(
                [
                    'name' => 'Aggregation',
                    'fields' => [
                        'field' => GraphQLType::nonNull(GraphQLType::string()),
                        'count' => GraphQLType::int(),
                        'label' => GraphQLType::string(),
                        'type' => GraphQLType::string(),
                        'options' => GraphQLType::listOf($aggregationOptionType),
                        'hasMore' => GraphQLType::boolean(),
                    ],
                ]
            );
            $this->typesContainer->set('Aggregation', $aggregationType);
        }

        return GraphQLType::listOf($aggregationType);
    }
}
