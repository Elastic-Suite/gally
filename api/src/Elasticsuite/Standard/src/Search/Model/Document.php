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

namespace Elasticsuite\Search\Model;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\GraphQl\Decoration\Resolver\Stage\ReadStage;
use Elasticsuite\Search\Elasticsearch\DocumentInterface;
use Elasticsuite\Search\GraphQl\Type\Definition\FieldFilterInputType;
use Elasticsuite\Search\GraphQl\Type\Definition\SortInputType;
use Elasticsuite\Search\Resolver\DummyResolver;

#[
    ApiResource(
        collectionOperations: [],
        graphql: [
            'search' => [
                'collection_query' => DummyResolver::class,
                'pagination_type' => 'page',
                'args' => [
                    'entityType' => ['type' => 'String!', 'description' => 'Entity Type'],
                    'catalogId' => ['type' => 'String!', 'description' => 'Catalog ID'],
                    'search' => ['type' => 'String', 'description' => 'Query Text'],
                    'currentPage' => ['type' => 'Int'],
                    'pageSize' => ['type' => 'Int'],
                    'sort' => ['type' => SortInputType::NAME],
                    'filter' => ['type' => '[' . FieldFilterInputType::NAME . ']', ReadStage::IS_GRAPHQL_ELASTICSUITE_ARG_KEY => true],
                ],
                'read' => true, // Required so the dataprovider is called.
                'deserialize' => true,
                'write' => false,
                'serialize' => true,
            ],
        ],
        itemOperations: [
            'get' => [
                'controller' => NotFoundAction::class,
                'read' => false,
                'output' => false,
            ],
        ],
        paginationClientEnabled: true,
        paginationClientItemsPerPage: true,
        paginationClientPartial: false,
        paginationEnabled: true,
        paginationItemsPerPage: 30, // Default items per page if pageSize not provided.
        paginationMaximumItemsPerPage: 100, // Max. allowed items per page.
    ),
]
class Document implements DocumentInterface
{
    /**
     * @var string
     */
    protected const ID = 'id';

    /**
     * @var string
     */
    protected const INTERNAL_ID = '_id';

    /**
     * @var string
     */
    protected const INDEX = '_index';

    /**
     * @var string
     */
    protected const TYPE = '_type';

    /**
     * @var string
     */
    protected const SCORE_DOC_FIELD_NAME = '_score';

    /**
     * @var string
     */
    protected const SOURCE_DOC_FIELD_NAME = '_source';

    public function __construct(private array $data = [])
    {
    }

    /**
     * Document ID.
     */
    public function getId(): string
    {
        $source = $this->getSource();

        $id = $source[self::ID] ?? $this->getInternalId();

        return (string) $id;
    }

    /**
     * Document internal ID.
     */
    public function getInternalId(): string
    {
        return (string) $this->data[self::INTERNAL_ID];
    }

    /**
     * Document index.
     */
    public function getIndex(): string
    {
        return $this->data[self::INDEX];
    }

    /**
     * Document type.
     */
    public function getType(): string
    {
        return $this->data[self::TYPE] ?? '_doc';
    }

    /**
     * Document score.
     */
    public function getScore(): float
    {
        return $this->data[self::SCORE_DOC_FIELD_NAME] ?? 0;
    }

    /**
     * Document source data.
     */
    public function getSource(): array
    {
        return $this->data[self::SOURCE_DOC_FIELD_NAME] ?? [];
    }

    /**
     * Document raw data.
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * Set document raw data.
     *
     * @param array $data Raw data
     */
    public function setData(array $data): void
    {
        $this->data = $data;
    }
}
