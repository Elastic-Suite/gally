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
use Elasticsuite\Search\Elasticsearch\DocumentInterface;
use Elasticsuite\Search\Resolver\DummyDocumentResolver;

#[
    ApiResource(
        collectionOperations: [],
        graphql: [
            'search' => [
                'collection_query' => DummyDocumentResolver::class,
                'pagination_type' => 'page',
                'args' => [
                    'entityType' => ['type' => 'String!', 'description' => 'Entity Type'],
                    'catalogId' => ['type' => 'String!', 'description' => 'Catalog ID'],
                    'currentPage' => ['type' => 'Int'],
                    'pageSize' => ['type' => 'Int'],
                    'sort' => ['type' => 'SortInput'],
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

        return $source[self::ID] ?? $this->getInternalId();
    }

    /**
     * Document internal ID.
     */
    public function getInternalId(): string
    {
        return $this->data[self::INTERNAL_ID];
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
