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

namespace Elasticsuite\Fixture\Service;

interface ElasticsearchFixturesInterface
{
    public const PREFIX_TEST_INDEX = 'elasticsuite_test__';

    public function loadFixturesIndexFiles(array $pathFiles): void;

    public function loadFixturesDocumentFiles(array $pathFiles): void;

    public function deleteTestFixtures(): void;
}
