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

namespace Elasticsuite\Search\Elasticsearch;

interface DocumentInterface
{
    /**
     * Get document ID.
     */
    public function getId(): ?string;

    /**
     * Get document internal ID.
     */
    public function getInternalId(): string;

    /**
     * Get document index name.
     */
    public function getIndex(): string;

    /**
     * Get document type.
     */
    public function getType(): string;

    /**
     * Get document score if defined or 0.
     */
    public function getScore(): float;

    /**
     * Get document source if defined as an array (possibly empty).
     */
    public function getSource(): array;
}
