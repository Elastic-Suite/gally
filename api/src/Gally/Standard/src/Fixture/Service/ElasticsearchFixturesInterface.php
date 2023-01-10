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

namespace Gally\Fixture\Service;

interface ElasticsearchFixturesInterface
{
    public const PREFIX_TEST_INDEX = 'gally_test__';

    public function loadFixturesIndexFiles(array $pathFiles): void;

    public function loadFixturesDocumentFiles(array $pathFiles): void;

    public function deleteTestFixtures(): void;
}
