<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @category  Elasticsuite
 * @package   Elasticsuite\Index
 * @author    Botis <botis@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Elasticsuite\Index\Repository\Index;

use Elasticsuite\Index\Model\Index;

interface IndexRepositoryInterface
{
    /**
     * @return Index[]
     */
    public function findAll(): array;

    public function findByName(string $indexName): ?Index;

    public function create(string $indexName, string $alias): Index;

    public function refresh(array $indexNames): void;

    public function delete(string $indexName): void;
}
