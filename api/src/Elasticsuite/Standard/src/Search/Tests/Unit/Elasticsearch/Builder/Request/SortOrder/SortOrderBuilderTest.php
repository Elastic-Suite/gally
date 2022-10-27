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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Builder\Request\SortOrder;

use Elasticsuite\Index\Model\Index\MappingInterface;
use Elasticsuite\Index\Service\MetadataManager;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SortOrder\Nested;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SortOrder\Script;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SortOrder\SortOrderBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;
use Elasticsuite\Test\AbstractTest;

class SortOrderBuilderTest extends AbstractTest
{
    private static QueryFactory $queryFactory;

    private static FilterQueryBuilder $filterQueryBuilder;

    private static MetadataRepository $metadataRepository;

    private static MetadataManager $metadataManager;

    private static SortOrderBuilder $sortOrderBuilder;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        \assert(static::getContainer()->get(QueryFactory::class) instanceof QueryFactory);
        self::$queryFactory = static::getContainer()->get(QueryFactory::class);
        self::$filterQueryBuilder = new FilterQueryBuilder(self::$queryFactory);
        self::$sortOrderBuilder = new SortOrderBuilder(self::$filterQueryBuilder);

        self::$metadataRepository = static::getContainer()->get(MetadataRepository::class);
        self::$metadataManager = static::getContainer()->get(MetadataManager::class);
        self::loadFixture([
            __DIR__ . '/../../../../../fixtures/catalogs.yaml',
            __DIR__ . '/../../../../../fixtures/source_field.yaml',
            __DIR__ . '/../../../../../fixtures/metadata.yaml',
        ]);
    }

    public function testInstantiate(): void
    {
        $reflector = new \ReflectionClass(SortOrderBuilder::class);
        $filterQueryBuilderProperty = $reflector->getProperty('queryBuilder');

        $sortOrderBuilder = new SortOrderBuilder(self::$filterQueryBuilder);
        $this->assertEquals($filterQueryBuilderProperty->getValue($sortOrderBuilder), self::$filterQueryBuilder);
    }

    /**
     * @dataProvider buildSortOrdersDataProvider
     *
     * @param string $entityType                  Entity type
     * @param array  $sortOrders                  Array of sort order specifications to build
     * @param array  $expectedSortOrderCollection Expected built sort orders
     */
    public function testBuildSortOrders(
        string $entityType,
        array $sortOrders,
        array $expectedSortOrderCollection
    ): void {
        $metadata = self::$metadataRepository->findOneBy(['entity' => $entityType]);
        $this->assertNotNull($metadata);
        $this->assertNotNull($metadata->getEntity());
        $mapping = self::$metadataManager->getMapping($metadata);
        $this->assertNotEmpty($mapping);

        $containerConfig = $this->getContainerConfiguration($mapping);
        $sortOrderCollection = self::$sortOrderBuilder->buildSortOrders($containerConfig, $sortOrders);
        $expectedSortOrderNum = \count($expectedSortOrderCollection);
        $this->assertCount($expectedSortOrderNum, $sortOrderCollection);
        for ($i = 0; $i < $expectedSortOrderNum; ++$i) {
            $sortOrder = &$sortOrderCollection[$i];
            $expectedSortOrder = &$expectedSortOrderCollection[$i];
            $this->assertEquals($expectedSortOrder['type'], $sortOrder->getType());
            $this->assertEquals($expectedSortOrder['field'], $sortOrder->getField());
            $this->assertEquals($expectedSortOrder['direction'], $sortOrder->getDirection());
            if (SortOrderInterface::TYPE_SCRIPT === $sortOrder->getType()) {
                /** @var Script $sortOrder */
                $this->assertEquals($expectedSortOrder['script'], $sortOrder->getScript());
            }
            if (SortOrderInterface::TYPE_NESTED === $sortOrder->getType()) {
                /** @var Nested $sortOrder */
                $this->assertNotNull($sortOrder->getNestedPath());
                if (\array_key_exists('nestedFilter', $expectedSortOrder) && $expectedSortOrder['nestedFilter']) {
                    $this->assertInstanceOf(QueryInterface::class, $sortOrder->getNestedFilter());
                } else {
                    $this->assertNull($sortOrder->getNestedFilter());
                }
            }
        }
    }

    protected function buildSortOrdersDataProvider(): array
    {
        return [
            [
                'product',  // entity type.
                [], // sort order specifications.
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => SortOrderInterface::DEFAULT_SORT_FIELD,
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                ],
            ],
            [
                'product',  // entity type.
                [   // sort order specifications.
                    'price.price' => [
                        'field' => 'price.price',
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                ],
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_NESTED,
                        'field' => 'price.price',
                        'direction' => SortOrderInterface::SORT_ASC,
                        'nestedPath' => 'price',
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => SortOrderInterface::DEFAULT_SORT_FIELD,
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                ],
            ],
            [
                'product',  // entity type.
                [   // sort order specifications.
                    'price.price' => [
                        'field' => 'price.price',
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                ],
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_NESTED,
                        'field' => 'price.price',
                        'direction' => SortOrderInterface::SORT_DESC,
                        'nestedPath' => 'price',
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => SortOrderInterface::DEFAULT_SORT_FIELD,
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                ],
            ],
            [
                'product',  // entity type.
                [   // sort order specifications.
                    'price.price' => [
                        'field' => 'price.price',
                        'direction' => SortOrderInterface::SORT_DESC,
                        'nestedFilter' => ['price.group_id' => 0],
                    ],
                ],
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_NESTED,
                        'field' => 'price.price',
                        'direction' => SortOrderInterface::SORT_DESC,
                        'nestedPath' => 'price',
                        'nestedFilter' => true,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => SortOrderInterface::DEFAULT_SORT_FIELD,
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                ],
            ],
            [
                'product',  // entity type.
                [   // sort order specifications.
                    'price.price' => [
                        'field' => 'price.price',
                        'direction' => SortOrderInterface::SORT_ASC,
                        'nestedFilter' => ['price.group_id' => 0],
                    ],
                ],
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_NESTED,
                        'field' => 'price.price',
                        'direction' => SortOrderInterface::SORT_ASC,
                        'nestedPath' => 'price',
                        'nestedFilter' => true,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => SortOrderInterface::DEFAULT_SORT_FIELD,
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                ],
            ],
            [
                'product',  // entity type.
                [   // sort order specifications.
                    Script::SCRIPT_FIELD => [
                        'field' => Script::SCRIPT_FIELD,
                        'direction' => SortOrderInterface::SORT_DESC,
                        'scriptType' => 'number',
                        'lang' => 'painless',
                        'source' => "doc['popularity'].value * params.factor",
                        'params' => ['factor' => 1.1],
                    ],
                ],
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_SCRIPT,
                        'field' => Script::SCRIPT_FIELD,
                        'direction' => SortOrderInterface::SORT_DESC,
                        'scriptType' => 'number',
                        'script' => [
                            'lang' => 'painless',
                            'source' => "doc['popularity'].value * params.factor",
                            'params' => ['factor' => 1.1],
                        ],
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => SortOrderInterface::DEFAULT_SORT_FIELD,
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                ],
            ],
            [
                'product',  // entity type.
                [   // sort order specifications.
                    // Ugly hack that allows dynamic product positioning.
                    Script::SCRIPT_FIELD => [
                        'field' => Script::SCRIPT_FIELD,
                        'direction' => [
                            'lang' => 'painless',
                            'scriptType' => 'number',
                            'source' => "if(params.scores.containsKey(doc['_id'].value)) { return params.scores[doc['_id'].value];} return 922337203685477600L",
                            'params' => ['scores' => [127 => 1, 849 => 2, 327 => 3]],
                            'direction' => SortOrderInterface::SORT_ASC,
                        ],
                    ],
                ],
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_SCRIPT,
                        'field' => Script::SCRIPT_FIELD,
                        'direction' => SortOrderInterface::SORT_ASC,
                        'scriptType' => 'number',
                        'script' => [
                            'lang' => 'painless',
                            'source' => "if(params.scores.containsKey(doc['_id'].value)) { return params.scores[doc['_id'].value];} return 922337203685477600L",
                            'params' => ['scores' => [127 => 1, 849 => 2, 327 => 3]],
                        ],
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => SortOrderInterface::DEFAULT_SORT_FIELD,
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                ],
            ],
            [
                'category', // entity type.
                [], // sort order specifications.
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => SortOrderInterface::DEFAULT_SORT_FIELD,
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                ],
            ],
            [
                'category', // entity type.
                [   // sort order specifications.
                    'id' => [
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                ],
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => SortOrderInterface::DEFAULT_SORT_FIELD,
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                ],
            ],
            [
                'category', // entity type.
                [   // sort order specifications.
                    'id' => [
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                ],
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => SortOrderInterface::DEFAULT_SORT_FIELD,
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                ],
            ],
            /* Not possible yet (analyzers not yet introduced in mapping)
            [
                'category',
                [
                    'name' => [
                        'field' => 'name',
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                ],
                [
                    [
                        'name' => [
                            'field' => 'name',
                            'direction' => SortOrderInterface::SORT_ASC,
                        ],
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => SortOrderInterface::DEFAULT_SORT_FIELD,
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                ],
            ],
            [
                'category',
                [
                    'name' => [
                        'field' => 'name',
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                ],
                [
                    [
                        'name' => [
                            'field' => 'name',
                            'direction' => SortOrderInterface::SORT_DESC,
                        ],
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => SortOrderInterface::DEFAULT_SORT_FIELD,
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                    [
                        'type' => SortOrderInterface::TYPE_STANDARD,
                        'field' => 'id',
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                ],
            ],
            */
        ];
    }

    protected function getContainerConfiguration(MappingInterface $mapping): ContainerConfigurationInterface
    {
        $containerConfig = $this->getMockBuilder(ContainerConfigurationInterface::class)
            ->disableOriginalConstructor()
            ->getMock();
        $containerConfig->method('getMapping')->willReturn($mapping);

        return $containerConfig;
    }
}
