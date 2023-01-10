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

namespace Elasticsuite\Index\Model\Index;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\Index\Dto\SelfReindexInput;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\MutationResolver\SelfReindexMutation;
use Elasticsuite\User\Constant\Role;
use Symfony\Component\Uid\Uuid;

#[
    ApiResource(
        collectionOperations: [
            'post' => [
                'path' => '/indices/self-reindex',
                'method' => 'POST',
                'input' => SelfReindexInput::class,
                'deserialize' => true,
                'read' => false,
                'write' => false,
                'serialize' => true,
                'openapi_context' => [
                    'description' => 'Reindex indices of one or all entities',
                    'summary' => 'Reindex locally one or more entity indices',
                ],
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            ],
        ],
        graphql: [
            'perform' => [
                'mutation' => SelfReindexMutation::class,
                'args' => [
                    'entityType' => ['type' => 'String', 'description' => 'Entity type for which to refresh indices'],
                ],
                'read' => false,
                'deserialize' => false,
                'write' => false,
                'serialize' => true,
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            ],
        ],
        itemOperations: [
            'get' => [
                'path' => '/indices/self-reindex',
                'controller' => NotFoundAction::class,
                'read' => false,
                'output' => false,
                'visible' => false,
            ],
        ],
    )
]
class SelfReindex
{
    public const STATUS_ABORTED = 'Aborted';

    public const STATUS_PROCESSING = 'Processing';

    public const STATUS_SUCCESS = 'Success';

    public const STATUS_FAILURE = 'Failure';

    #[ApiProperty(identifier: true)]
    private ?string $id;

    private array $entityTypes;

    private string $status;

    private array $indexNames;

    public function __construct(?string $id = null)
    {
        if (null === $id) {
            $id = Uuid::v1()::generate();
        }
        $this->id = $id;
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(?string $id): void
    {
        $this->id = $id;
    }

    /**
     * Set entity types for which reindexing should occur.
     *
     * @param string[] $entityTypes Entity types
     */
    public function setEntityTypes(array $entityTypes = []): void
    {
        $this->entityTypes = $entityTypes;
    }

    /**
     * Get entity types for which reindexing should occur.
     *
     * @return string[]
     */
    public function getEntityTypes(): array
    {
        return $this->entityTypes;
    }

    /**
     * Set current reindex status.
     *
     * @param string $status Status
     */
    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    /**
     * Get current self-reindex status.
     */
    public function getStatus(): string
    {
        return $this->status;
    }

    /**
     * Add an index name to the list of index names already created by the self-reindex.
     *
     * @param string $indexName Index name
     */
    public function addIndexName(string $indexName): void
    {
        $this->indexNames[] = $indexName;
    }

    /**
     * Set the list of index names created by the self-reindex.
     */
    public function setIndexNames(array $indexNames = []): void
    {
        $this->indexNames = $indexNames;
    }

    /**
     * Get the list of index names created so far by the self-reindex.
     *
     * @return string[]
     */
    public function getIndexNames(): array
    {
        return $this->indexNames;
    }
}
