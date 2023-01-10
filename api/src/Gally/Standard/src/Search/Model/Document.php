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

namespace Gally\Search\Model;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use Gally\GraphQl\Decoration\Resolver\Stage\ReadStage;
use Gally\Search\Elasticsearch\DocumentInterface;
use Gally\Search\GraphQl\Type\Definition\FieldFilterInputType;
use Gally\Search\GraphQl\Type\Definition\SortInputType;
use Gally\Search\Resolver\DummyResolver;

#[
    ApiResource(
        collectionOperations: [],
        graphql: [
            'search' => [
                'collection_query' => DummyResolver::class,
                'pagination_type' => 'page',
                'args' => [
                    'entityType' => ['type' => 'String!', 'description' => 'Entity Type'],
                    'localizedCatalog' => ['type' => 'String!', 'description' => 'Localized Catalog'],
                    'search' => ['type' => 'String', 'description' => 'Query Text'],
                    'currentPage' => ['type' => 'Int'],
                    'pageSize' => ['type' => 'Int'],
                    'sort' => ['type' => SortInputType::NAME],
                    'filter' => ['type' => '[' . FieldFilterInputType::NAME . ']', ReadStage::IS_GRAPHQL_GALLY_ARG_KEY => true],
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
