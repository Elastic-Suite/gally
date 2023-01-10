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

namespace Gally\Search\Model\Facet;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Gally\Category\Model\Category;
use Gally\Entity\Filter\RangeFilterWithDefault;
use Gally\Entity\Filter\SearchFilterWithDefault;
use Gally\Entity\Filter\VirtualSearchFilter;
use Gally\Metadata\Model\SourceField;
use Gally\Search\Elasticsearch\Request\BucketInterface;
use Gally\User\Constant\Role;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'FacetConfiguration',
    collectionOperations: [
        'get',
    ],
    itemOperations: [
        'get',
        'put' => [
            'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            'normalization_context' => ['groups' => ['facet_configuration:read']],
            'denormalization_context' => ['groups' => ['facet_configuration:write']],
        ],
        'patch' => [
            'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            'normalization_context' => ['groups' => ['facet_configuration:read']],
            'denormalization_context' => ['groups' => ['facet_configuration:write']],
        ],
        'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
    ],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['facet_configuration:read', 'facet_configuration:graphql_read']],
            'denormalization_context' => ['groups' => ['facet_configuration:read', 'facet_configuration:graphql_read']],
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['facet_configuration:read', 'facet_configuration:graphql_read']],
            'denormalization_context' => ['groups' => ['facet_configuration:read', 'facet_configuration:graphql_read']],
            'pagination_type' => 'page',
        ],
        'update' => [
            'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            'normalization_context' => ['groups' => ['facet_configuration:read', 'facet_configuration:graphql_read']],
            'denormalization_context' => ['groups' => ['facet_configuration:write']],
        ],
        'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
    ],
    normalizationContext: ['groups' => ['facet_configuration:read']],
    denormalizationContext: ['groups' => ['facet_configuration:read']],
    attributes: [
        'gally' => [
            // Allows to add cache tag "/source_fields" in the HTTP response to invalidate proxy cache when a source field is saved.
            'cache_tag' => ['resource_classes' => [SourceField::class]],
        ],
    ],
)]
#[ApiFilter(VirtualSearchFilter::class, properties: ['search' => ['type' => 'string', 'strategy' => 'ipartial']])]
#[ApiFilter(SearchFilterWithDefault::class, properties: ['sourceField.metadata.entity' => 'exact', 'category' => 'exact', 'displayMode' => 'exact', 'sortOrder' => 'exact'], arguments: ['defaultValues' => self::DEFAULT_VALUES])]
#[ApiFilter(RangeFilterWithDefault::class, properties: ['coverageRate', 'maxSize'], arguments: ['defaultValues' => self::DEFAULT_VALUES])]
class Configuration
{
    public const DISPLAY_MODE_AUTO = 'auto';
    public const DISPLAY_MODE_ALWAYS_DISPLAYED = 'displayed';
    public const DISPLAY_MODE_ALWAYS_HIDDEN = 'hidden';

    private const DEFAULT_VALUES = [
        'displayMode' => self::DISPLAY_MODE_AUTO,
        'coverageRate' => 90,
        'maxSize' => 10,
        'sortOrder' => BucketInterface::SORT_ORDER_COUNT,
        'isRecommendable' => false,
        'isVirtual' => false,
        'position' => 0,
    ];

    #[Groups(['facet_configuration:read'])]
    private string $id;

    #[Groups(['facet_configuration:read'])]
    private SourceField $sourceField;

    #[Groups(['facet_configuration:read'])]
    private ?Category $category;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Display',
                ],
                'gally' => [
                    'visible' => true,
                    'editable' => true,
                    'position' => 20,
                    'input' => 'select',
                    'options' => [
                        'values' => [
                            ['value' => self::DISPLAY_MODE_AUTO, 'label' => 'Auto'],
                            ['value' => self::DISPLAY_MODE_ALWAYS_DISPLAYED, 'label' => 'Displayed'],
                            ['value' => self::DISPLAY_MODE_ALWAYS_HIDDEN, 'label' => 'Hidden'],
                        ],
                    ],
                ],
            ],
        ],
    )]
    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?string $displayMode = null;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Coverage',
                ],
                'gally' => [
                    'visible' => true,
                    'editable' => true,
                    'position' => 30,
                    'input' => 'percentage',
                    'validation' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                ],
            ],
        ],
    )]
    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?int $coverageRate = null;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Max size',
                ],
                'gally' => [
                    'visible' => true,
                    'editable' => true,
                    'position' => 40,
                    'validation' => [
                        'min' => 0,
                    ],
                ],
            ],
        ],
    )]
    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?int $maxSize = null;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Sort order',
                ],
                'gally' => [
                    'visible' => true,
                    'editable' => true,
                    'position' => 50,
                    'input' => 'select',
                    'options' => [
                        'values' => [
                            ['value' => BucketInterface::SORT_ORDER_COUNT, 'label' => 'Result count'],
                            ['value' => BucketInterface::SORT_ORDER_MANUAL, 'label' => 'Admin sort'],
                            ['value' => BucketInterface::SORT_ORDER_TERM, 'label' => 'Name'],
                            ['value' => BucketInterface::SORT_ORDER_RELEVANCE, 'label' => 'Relevance'],
                        ],
                    ],
                ],
            ],
        ],
    )]
    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?string $sortOrder = null;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Facet recommenders',
                ],
                'gally' => [
                    'visible' => false,
                    'editable' => true,
                    'position' => 60,
                ],
            ],
        ],
    )]
    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?bool $isRecommendable = null;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Virtual attributes',
                ],
                'gally' => [
                    'visible' => false,
                    'editable' => true,
                    'position' => 70,
                ],
            ],
        ],
    )]
    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?bool $isVirtual = null;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Position',
                ],
                'gally' => [
                    'visible' => true,
                    'editable' => true,
                    'position' => 80,
                    'input' => 'text',
                ],
            ],
        ],
    )]
    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?int $position = null;

    #[Groups(['facet_configuration:read'])]
    private ?string $defaultDisplayMode = null;

    #[Groups(['facet_configuration:read'])]
    private ?int $defaultCoverageRate = null;

    #[Groups(['facet_configuration:read'])]
    private ?int $defaultMaxSize = null;

    #[Groups(['facet_configuration:read'])]
    private ?string $defaultSortOrder = null;

    #[Groups(['facet_configuration:read'])]
    private ?bool $defaultIsRecommendable = null;

    #[Groups(['facet_configuration:read'])]
    private ?bool $defaultIsVirtual = null;

    #[Groups(['facet_configuration:read'])]
    private ?int $defaultPosition = null;

    public function __construct(SourceField $sourceField, ?Category $category)
    {
        $this->sourceField = $sourceField;
        $this->category = $category;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): void
    {
        $this->id = $id;
    }

    public function getSourceField(): SourceField
    {
        return $this->sourceField;
    }

    public function setSourceField(SourceField $sourceField): void
    {
        $this->sourceField = $sourceField;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): void
    {
        $this->category = $category;
    }

    public function getDisplayMode(): ?string
    {
        return $this->displayMode ?? $this->getDefaultDisplayMode();
    }

    public function setDisplayMode(?string $displayMode): void
    {
        $this->displayMode = '' == $displayMode ? null : $displayMode;
    }

    public function getCoverageRate(): ?int
    {
        return $this->coverageRate ?? $this->getDefaultCoverageRate();
    }

    public function setCoverageRate(?int $coverageRate): void
    {
        $this->coverageRate = '' == $coverageRate ? null : $coverageRate;
    }

    public function getMaxSize(): ?int
    {
        return $this->maxSize ?? $this->getDefaultMaxSize();
    }

    public function setMaxSize(?int $maxSize): void
    {
        $this->maxSize = $maxSize;
    }

    public function getSortOrder(): ?string
    {
        return $this->sortOrder ?? $this->getDefaultSortOrder();
    }

    public function setSortOrder(?string $sortOrder): void
    {
        $this->sortOrder = $sortOrder;
    }

    public function getIsRecommendable(): ?bool
    {
        return $this->isRecommendable ?? $this->getDefaultIsRecommendable();
    }

    public function setIsRecommendable(?bool $isRecommendable): void
    {
        $this->isRecommendable = $isRecommendable;
    }

    public function getIsVirtual(): ?bool
    {
        return $this->isVirtual ?? $this->getDefaultIsVirtual();
    }

    public function setIsVirtual(?bool $isVirtual): void
    {
        $this->isVirtual = $isVirtual;
    }

    public function getPosition(): ?int
    {
        return $this->position ?? $this->getDefaultPosition();
    }

    public function setPosition(?int $position): void
    {
        $this->position = $position;
    }

    public function getDefaultDisplayMode(): ?string
    {
        return $this->defaultDisplayMode;
    }

    public function getDefaultCoverageRate(): ?int
    {
        return $this->defaultCoverageRate;
    }

    public function getDefaultMaxSize(): ?int
    {
        return $this->defaultMaxSize;
    }

    public function getDefaultSortOrder(): ?string
    {
        return $this->defaultSortOrder;
    }

    public function getDefaultIsRecommendable(): ?bool
    {
        return $this->defaultIsRecommendable;
    }

    public function getDefaultIsVirtual(): ?bool
    {
        return $this->defaultIsVirtual;
    }

    public function getDefaultPosition(): ?int
    {
        return $this->defaultPosition;
    }

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Attribute code',
                ],
                'gally' => [
                    'visible' => true,
                    'editable' => false,
                    'position' => 10,
                ],
            ],
        ],
    )]
    #[Groups(['facet_configuration:read'])]
    public function getSourceFieldCode(): string
    {
        return $this->getSourceField()->getCode();
    }

    public function initDefaultValue(self $defaultConfiguration)
    {
        $this->defaultDisplayMode = $defaultConfiguration->getDisplayMode() ?? self::DEFAULT_VALUES['displayMode'];
        $this->defaultCoverageRate = $defaultConfiguration->getCoverageRate() ?? self::DEFAULT_VALUES['coverageRate'];
        $this->defaultMaxSize = $defaultConfiguration->getMaxSize() ?? self::DEFAULT_VALUES['maxSize'];
        $this->defaultSortOrder = $defaultConfiguration->getSortOrder() ?? self::DEFAULT_VALUES['sortOrder'];
        $this->defaultIsRecommendable = $defaultConfiguration->getIsRecommendable() ?? self::DEFAULT_VALUES['isRecommendable'];
        $this->defaultIsVirtual = $defaultConfiguration->getIsVirtual() ?? self::DEFAULT_VALUES['isVirtual'];
        $this->defaultPosition = $defaultConfiguration->getPosition() ?? self::DEFAULT_VALUES['position'];
    }

    public static function getAvailableDisplayModes(): array
    {
        return [
            self::DISPLAY_MODE_AUTO,
            self::DISPLAY_MODE_ALWAYS_DISPLAYED,
            self::DISPLAY_MODE_ALWAYS_HIDDEN,
        ];
    }

    public static function getAvailableSortOrder(): array
    {
        return [
            BucketInterface::SORT_ORDER_COUNT,
            BucketInterface::SORT_ORDER_TERM,
            BucketInterface::SORT_ORDER_RELEVANCE,
            BucketInterface::SORT_ORDER_MANUAL,
        ];
    }
}
