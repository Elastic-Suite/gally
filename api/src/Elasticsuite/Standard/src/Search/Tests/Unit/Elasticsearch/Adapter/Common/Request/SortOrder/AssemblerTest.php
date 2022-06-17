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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\SortOrder;

use Elasticsuite\Index\Model\Index\Mapping\FieldInterface;
use Elasticsuite\Index\Model\Index\MappingInterface;
use Elasticsuite\Index\Service\MetadataManager;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler as QueryAssembler;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\SortOrder\Assembler as SortAssembler;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SortOrder\Nested;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SortOrder\Script;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SortOrder\SortOrderBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;
use Elasticsuite\Standard\src\Test\AbstractTest;

class AssemblerTest extends AbstractTest
{
    private static QueryFactory $queryFactory;

    private static FilterQueryBuilder $filterQueryBuilder;

    private static MetadataRepository $metadataRepository;

    private static MetadataManager $metadataManager;

    private static SortOrderBuilder $sortOrderBuilder;

    private static QueryAssembler $queryAssembler;

    private static SortAssembler $sortAssembler;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        \assert(static::getContainer()->get(QueryFactory::class) instanceof QueryFactory);
        self::$queryFactory = static::getContainer()->get(QueryFactory::class);
        self::$filterQueryBuilder = new FilterQueryBuilder(self::$queryFactory);
        self::$sortOrderBuilder = new SortOrderBuilder(self::$filterQueryBuilder);
        self::$queryAssembler = static::getContainer()->get(QueryAssembler::class);
        self::$sortAssembler = new SortAssembler(self::$queryAssembler);

        self::loadFixture([
            __DIR__ . '/../../../../../../fixtures/metadata.yaml',
            __DIR__ . '/../../../../../../fixtures/source_field.yaml',
        ]);

        self::$metadataRepository = static::getContainer()->get(MetadataRepository::class);
        self::$metadataManager = static::getContainer()->get(MetadataManager::class);
    }

    /**
     * @dataProvider assembleNestedSortOrdersDataProvider
     *
     * @param string $entityType                  Entity type
     * @param array  $sortOrders                  Request level sort orders specifications
     * @param array  $expectedBuiltSortOrders     Expected built sort orders collection
     * @param array  $expectedAssembledSortOrders Expected assembled sort orders
     */
    public function testAssembleNestedSortOrders(
        string $entityType,
        array $sortOrders,
        array $expectedBuiltSortOrders,
        array $expectedAssembledSortOrders
    ): void {
        $metadata = self::$metadataRepository->findOneBy(['entity' => $entityType]);
        $this->assertNotNull($metadata);
        $this->assertNotNull($metadata->getEntity());
        $mapping = self::$metadataManager->getMapping($metadata);
        $this->assertNotEmpty($mapping);

        $containerConfig = $this->getContainerConfiguration($mapping);
        $builtSortOrders = self::$sortOrderBuilder->buildSortOrders($containerConfig, $sortOrders);
        $expectedSortOrderNum = \count($expectedAssembledSortOrders);
        $this->assertCount($expectedSortOrderNum, $builtSortOrders);

        for ($i = 0; $i < $expectedSortOrderNum; ++$i) {
            $sortOrder = &$builtSortOrders[$i];
            $expectedBuiltSortOrder = &$expectedBuiltSortOrders[$i];
            $this->assertEquals($expectedBuiltSortOrder['type'], $sortOrder->getType());
            $this->assertEquals($expectedBuiltSortOrder['field'], $sortOrder->getField());
            $this->assertEquals($expectedBuiltSortOrder['direction'], $sortOrder->getDirection());
            if (SortOrderInterface::TYPE_SCRIPT === $sortOrder->getType()) {
                /** @var Script $sortOrder */
                $this->assertEquals($expectedBuiltSortOrder['script'], $sortOrder->getScript());
            }
            if (SortOrderInterface::TYPE_NESTED === $sortOrder->getType()) {
                /** @var Nested $sortOrder */
                $this->assertNotNull($sortOrder->getNestedPath());
                if (\array_key_exists('nestedFilter', $expectedBuiltSortOrder) && $expectedBuiltSortOrder['nestedFilter']) {
                    $this->assertInstanceOf(QueryInterface::class, $sortOrder->getNestedFilter());
                } else {
                    $this->assertNull($sortOrder->getNestedFilter());
                }
            }
        }

        $assembledSortOrders = self::$sortAssembler->assembleSortOrders($builtSortOrders);
        for ($i = 0; $i < $expectedSortOrderNum; ++$i) {
            $assembledSortOrder = &$assembledSortOrders[$i];
            $expectedAssembledSortOrder = &$expectedAssembledSortOrders[$i];
            $this->assertEquals($expectedAssembledSortOrder, $assembledSortOrder);
        }
    }

    public function assembleNestedSortOrdersDataProvider(): array
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
                [   // expected assembled sort orders.
                    [
                        SortOrderInterface::DEFAULT_SORT_FIELD => [
                            'order' => SortOrderInterface::SORT_DESC,
                        ],
                    ],
                    [
                        'id' => [
                            'order' => SortOrderInterface::SORT_DESC,
                            'missing' => SortOrderInterface::MISSING_FIRST,
                            'unmapped_type' => FieldInterface::FIELD_TYPE_KEYWORD,
                        ],
                    ],
                ],
            ],
            [
                'product',  // entity type.
                [   // sort order specifications.
                    'price.final_price' => [
                        'field' => 'price.final_price',
                        'direction' => SortOrderInterface::SORT_ASC,
                    ],
                ],
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_NESTED,
                        'field' => 'price.final_price',
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
                [   // expected assembled sort orders.
                    [
                        'price.final_price' => [
                            'order' => SortOrderInterface::SORT_ASC,
                            'missing' => SortOrderInterface::MISSING_LAST,
                            'unmapped_type' => 'keyword',
                            'nested' => ['path' => 'price'],
                            'mode' => SortOrderInterface::SCORE_MODE_MIN,
                        ],
                    ],
                    [
                        SortOrderInterface::DEFAULT_SORT_FIELD => [
                            'order' => SortOrderInterface::SORT_DESC,
                        ],
                    ],
                    [
                        'id' => [
                            'order' => SortOrderInterface::SORT_DESC,
                            'missing' => SortOrderInterface::MISSING_FIRST,
                            'unmapped_type' => FieldInterface::FIELD_TYPE_KEYWORD,
                        ],
                    ],
                ],
            ],
            [
                'product',  // entity type.
                [   // sort order specifications.
                    'price.final_price' => [
                        'field' => 'price.final_price',
                        'direction' => SortOrderInterface::SORT_DESC,
                    ],
                ],
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_NESTED,
                        'field' => 'price.final_price',
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
                [
                    // expected assembled sort orders.
                    [
                        'price.final_price' => [
                            'order' => SortOrderInterface::SORT_DESC,
                            'missing' => SortOrderInterface::MISSING_FIRST,
                            'unmapped_type' => 'keyword',
                            'nested' => ['path' => 'price'],
                            'mode' => SortOrderInterface::SCORE_MODE_MIN,
                        ],
                    ],
                    [
                        SortOrderInterface::DEFAULT_SORT_FIELD => [
                            'order' => SortOrderInterface::SORT_ASC,
                        ],
                    ],
                    [
                        'id' => [
                            'order' => SortOrderInterface::SORT_ASC,
                            'missing' => SortOrderInterface::MISSING_LAST,
                            'unmapped_type' => FieldInterface::FIELD_TYPE_KEYWORD,
                        ],
                    ],
                ],
            ],
            [
                'product',  // entity type.
                [   // sort order specifications.
                    'price.final_price' => [
                        'field' => 'price.final_price',
                        'direction' => SortOrderInterface::SORT_DESC,
                        'nestedFilter' => ['price.group_id' => 0],
                    ],
                ],
                [   // expected built sort orders.
                    [
                        'type' => SortOrderInterface::TYPE_NESTED,
                        'field' => 'price.final_price',
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
                [   // expected assembled sort orders.
                    [
                        'price.final_price' => [
                            'order' => SortOrderInterface::SORT_DESC,
                            'missing' => SortOrderInterface::MISSING_FIRST,
                            'nested' => [
                                'path' => 'price',
                                'filter' => [
                                    'terms' => [
                                        'price.group_id' => [0],
                                        'boost' => 1,
                                    ],
                                ],
                            ],
                            'mode' => SortOrderInterface::SCORE_MODE_MIN,
                            'unmapped_type' => 'keyword',
                        ],
                    ],
                    [
                        SortOrderInterface::DEFAULT_SORT_FIELD => [
                            'order' => SortOrderInterface::SORT_ASC,
                        ],
                    ],
                    [
                        'id' => [
                            'order' => SortOrderInterface::SORT_ASC,
                            'missing' => SortOrderInterface::MISSING_LAST,
                            'unmapped_type' => FieldInterface::FIELD_TYPE_KEYWORD,
                        ],
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
                [
                    [
                        Script::SCRIPT_FIELD => [
                            'order' => SortOrderInterface::SORT_DESC,
                            'type' => 'number',
                            'script' => [
                                'lang' => 'painless',
                                'source' => "doc['popularity'].value * params.factor",
                                'params' => ['factor' => 1.1],
                            ],
                        ],
                    ],
                    [
                        SortOrderInterface::DEFAULT_SORT_FIELD => [
                            'order' => SortOrderInterface::SORT_ASC,
                        ],
                    ],
                    [
                        'id' => [
                            'order' => SortOrderInterface::SORT_ASC,
                            'missing' => SortOrderInterface::MISSING_LAST,
                            'unmapped_type' => FieldInterface::FIELD_TYPE_KEYWORD,
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
                    [
                        [
                            Script::SCRIPT_FIELD => [
                                'order' => SortOrderInterface::SORT_ASC,
                                'type' => 'number',
                                'script' => [
                                    'lang' => 'painless',
                                    'source' => "if(params.scores.containsKey(doc['_id'].value)) { return params.scores[doc['_id'].value];} return 922337203685477600L",
                                    'params' => ['scores' => [127 => 1, 849 => 2, 327 => 3]],
                                ],
                            ],
                        ],
                        [
                            SortOrderInterface::DEFAULT_SORT_FIELD => [
                                'order' => SortOrderInterface::SORT_DESC,
                            ],
                        ],
                        [
                            'id' => [
                                'order' => SortOrderInterface::SORT_DESC,
                                'missing' => SortOrderInterface::MISSING_FIRST,
                                'unmapped_type' => 'keyword',
                            ],
                        ],
                    ],
                ],
            ],
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
