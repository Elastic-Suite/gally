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

namespace Elasticsuite\Stitching\Decoration\GraphQl\Type;

use ApiPlatform\Core\GraphQl\Type\FieldsBuilderInterface;
use ApiPlatform\Core\GraphQl\Type\TypesContainerInterface;
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use ApiPlatform\Core\Metadata\Resource\ResourceMetadata;
use Doctrine\ORM\EntityNotFoundException;
use Elasticsuite\Entity\Constant\SourceFieldAttributeMapping;
use Elasticsuite\Entity\Model\Attribute\GraphQlAttributeInterface;
use Elasticsuite\Entity\Model\Attribute\StructuredAttributeInterface;
use Elasticsuite\Metadata\Model\Metadata;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\ResourceMetadata\Service\ResourceMetadataManager;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type as GraphQLType;

/**
 * Allows to add dynamically attributes to an entity on GraphQL documentation.
 *
 * @todo: This is a first version of the stitching, this feature would be finalized when we will know how to manage attributes on entities.
 */
class StitchingFieldsBuilder implements FieldsBuilderInterface
{
    public function __construct(
        private MetadataRepository $metadataRepository,
        private ResourceMetadataFactoryInterface $resourceMetadataFactory,
        private ResourceMetadataManager $resourceMetadataManager,
        private TypesContainerInterface $typesContainer,
        private FieldsBuilderInterface $decorated,
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function getResourceObjectTypeFields(
        ?string $resourceClass,
        ResourceMetadata $resourceMetadata,
        bool $input,
        ?string $queryName,
        ?string $mutationName,
        ?string $subscriptionName,
        int $depth,
        ?array $ioMetadata
    ): array {
        $fields = $this->decorated->getResourceObjectTypeFields(
            $resourceClass, $resourceMetadata, $input, $queryName, $mutationName, $subscriptionName, $depth, $ioMetadata
        );

        $resourceMetadata = $this->resourceMetadataFactory->create($resourceClass);
        $metadataEntity = $this->resourceMetadataManager->getMetadataEntity($resourceMetadata);
        $stitchingProperty = $this->resourceMetadataManager->getStitchingProperty($resourceMetadata);

        /*
         * All these tests have been get from the "decorated" function (\ApiPlatform\Core\GraphQl\Type\FieldsBuilder::getResourceObjectTypeFields),
         * if one of these tests is true we don't make the stitching because it's not necessary.
         *
         */
        if ((null !== $ioMetadata && \array_key_exists('class', $ioMetadata) && null === $ioMetadata['class'])
            || (null !== $subscriptionName && $input)
            || ('delete' === $mutationName)
            || (null === $metadataEntity || null === $stitchingProperty) // Check if we have necessary ApiResource data to make the stitching.
        ) {
            return $fields;
        }

        $metadata = $this->metadataRepository->findOneBy(['entity' => $metadataEntity]);
        if (null === $metadata) {
            throw new EntityNotFoundException(sprintf("Entity of type '%s' for entity '%s' was not found. You should probably run migrations or fixtures?", Metadata::class, $metadataEntity));
        }

        unset($fields[$stitchingProperty]);
        $basicNestedFields = [];
        $structuredFields = [];
        /** @var SourceField $sourceField */
        foreach ($metadata->getSourceFields() as $sourceField) {
            if (!isset($fields[$sourceField->getCode()])) {
                /** @var GraphQlAttributeInterface|string|null $attributeClassType */
                $attributeClassType = SourceFieldAttributeMapping::TYPES[$sourceField->getType()] ?? null;

                if (
                    null === $attributeClassType
                    || (
                        !is_subclass_of($attributeClassType, GraphQlAttributeInterface::class)
                        && !is_subclass_of($attributeClassType, StructuredAttributeInterface::class)
                    )
                ) {
                    throw new \LogicException(sprintf("The class '%s' doesn't implement neither the interface '%s' nor the interface '%s'", $attributeClassType, GraphQlAttributeInterface::class, StructuredAttributeInterface::class));
                }

                if (is_subclass_of($attributeClassType, StructuredAttributeInterface::class)) {
                    $structuredFields[$sourceField->getCode()] = $attributeClassType;
                } elseif (false === $sourceField->isNested()) {
                    $fields[$sourceField->getCode()] = $this->getField($attributeClassType);
                } else {
                    // There are max two levels.
                    // 'stock.qty' become $nonScalarFields['stock']['qty'].
                    [$path, $code] = [$sourceField->getNestedPath(), $sourceField->getNestedCode()];
                    $basicNestedFields[$path][$code]['source_field'] = $sourceField;
                    $basicNestedFields[$path][$code]['class_type'] = $attributeClassType;
                }
            }
        }

        $fields = $this->processStructuredFields($structuredFields, $fields);

        return $this->processBasicNestedFields($basicNestedFields, $fields);
    }

    public function getObjectType(string $typeName, string $description, array $fields): GraphQLType
    {
        if ($this->typesContainer->has($typeName)) {
            return $this->typesContainer->get($typeName);
        }

        $configuration = [
            'name' => $typeName,
            'description' => $description,
            'interfaces' => [],
        ];
        foreach ($fields as $fieldName => $field) {
            $configuration['fields'][$fieldName] = $this->getField($field['class_type']);
        }

        $objectType = new ObjectType($configuration);
        $this->typesContainer->set($typeName, $objectType);

        return $objectType;
    }

    public function processBasicNestedFields(array $basicNestedFields, array $fields): array
    {
        // This part has been inspired by the function \ApiPlatform\Core\GraphQl\Type\TypeBuilder::getResourceObjectType.
        foreach ($basicNestedFields as $nestedPath => $children) {
            $shortName = ucfirst($nestedPath) . 'Attribute';
            $typeDescription = ucfirst($nestedPath) . ' attribute.';

            $objectType = $this->getObjectType($shortName, $typeDescription, $children);

            $fields[$nestedPath] = [
                'type' => $objectType,
                'description' => null,
                'args' => [],
                'resolve' => null,
                'deprecationReason' => null,
            ];
        }

        return $fields;
    }

    public function processStructuredFields(array $structuredFields, array $fields): array
    {
        // This part has been inspired by the function \ApiPlatform\Core\GraphQl\Type\TypeBuilder::getResourceObjectType.
        /**
         * @var StructuredAttributeInterface $structuredAttributeClass
         */
        foreach ($structuredFields as $structuredFieldName => $structuredAttributeClass) {
            $shortName = ucfirst($structuredFieldName) . 'Attribute';
            $typeDescription = ucfirst($structuredFieldName) . ' attribute.';

            $objectType = $this->getObjectType($shortName, $typeDescription, $structuredAttributeClass::getFields());

            $parentType = $structuredAttributeClass::isList() ? GraphQLType::listOf($objectType) : $objectType;
            $fields[$structuredFieldName] = [
                'type' => $parentType,
                'description' => null,
                'args' => [],
                'resolve' => null,
                'deprecationReason' => null,
            ];
        }

        return $fields;
    }

    public function getField(
        string $attributeClassType,
        ?string $description = null,
        array $args = [],
        ?callable $resolve = null,
        ?string $deprecationReason = null
    ): array {
        // This part has been inspired by the function \ApiPlatform\Core\GraphQl\Type\FieldsBuilder::getResourceFieldConfiguration.
        /** @var GraphQlAttributeInterface $attributeClassType */
        return [
            'type' => $attributeClassType::getGraphQlType(),
            'description' => $description,
            'args' => $args,
            'resolve' => $resolve,
            'deprecationReason' => $deprecationReason,
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getNodeQueryFields(): array
    {
        return $this->decorated->getNodeQueryFields();
    }

    /**
     * {@inheritdoc}
     */
    public function getItemQueryFields(
        string $resourceClass,
        ResourceMetadata $resourceMetadata,
        string $queryName,
        array $configuration
    ): array {
        return $this->decorated->getItemQueryFields($resourceClass, $resourceMetadata, $queryName, $configuration);
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
        return $this->decorated->getCollectionQueryFields($resourceClass, $resourceMetadata, $queryName, $configuration);
    }

    /**
     * {@inheritdoc}
     */
    public function getMutationFields(
        string $resourceClass,
        ResourceMetadata $resourceMetadata,
        string $mutationName
    ): array {
        return $this->decorated->getMutationFields($resourceClass, $resourceMetadata, $mutationName);
    }

    /**
     * {@inheritdoc}
     */
    public function getSubscriptionFields(
        string $resourceClass,
        ResourceMetadata $resourceMetadata,
        string $subscriptionName
    ): array {
        return $this->decorated->getSubscriptionFields($resourceClass, $resourceMetadata, $subscriptionName);
    }

    /**
     * {@inheritdoc}
     */
    public function resolveResourceArgs(array $args, string $operationName, string $shortName): array
    {
        return $this->decorated->resolveResourceArgs($args, $operationName, $shortName);
    }
}
