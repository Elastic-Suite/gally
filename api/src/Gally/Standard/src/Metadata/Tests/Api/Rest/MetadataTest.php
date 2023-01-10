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

namespace Gally\Metadata\Tests\Api\Rest;

use Gally\Metadata\Model\Metadata;
use Gally\Test\AbstractEntityTest;
use Gally\User\Constant\Role;

class MetadataTest extends AbstractEntityTest
{
    protected static function getFixtureFiles(): array
    {
        return [__DIR__ . '/../../fixtures/metadata.yaml'];
    }

    protected function getEntityClass(): string
    {
        return Metadata::class;
    }

    /**
     * {@inheritDoc}
     */
    public function createDataProvider(): iterable
    {
        $adminUser = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), ['entity' => 'article'], 403],
            [$adminUser, ['entity' => 'article']],
            [$adminUser, ['entity' => 'author']],
            [$adminUser, ['entity' => ''], 422, 'entity: This value should not be blank.'],
            [$adminUser, ['entity' => 'product'], 422, 'entity: This value is already used.'],
            [$adminUser, ['entity' => 'category'], 422, 'entity: This value is already used.'],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getDataProvider(): iterable
    {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        return [
            [$user, 1, ['id' => 1, 'entity' => 'product'], 200],
            [$user, 3, ['id' => 3, 'entity' => 'article'], 200],
            [$user, 5, [], 404],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function deleteDataProvider(): iterable
    {
        $adminUser = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), 1, 403],
            [$adminUser, 1, 204],
            [$adminUser, 3, 204],
            [$adminUser, 5, 404],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getCollectionDataProvider(): iterable
    {
        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), 2, 200],
        ];
    }
}
