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

namespace Elasticsuite\Index\Repository\Document;

interface DocumentRepositoryInterface
{
    public function index(string $indexName, array $documents, bool $instantRefresh = false): void;

    public function delete(string $indexName, array $documents): void;
}
