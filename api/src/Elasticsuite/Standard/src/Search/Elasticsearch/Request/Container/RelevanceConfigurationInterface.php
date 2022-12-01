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

namespace Elasticsuite\Search\Elasticsearch\Request\Container;

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Search\Elasticsearch\Request\Container\RelevanceConfiguration\FuzzinessConfigurationInterface;

/**
 * Search Relevance configuration interface.
 * Used to retrieve relevance configuration.
 */
interface RelevanceConfigurationInterface
{
    /**
     * Init config data.
     */
    public function initConfigData(?LocalizedCatalog $localizedCatalog, ?string $requestType): void;

    /**
     * Retrieve minimum should match.
     */
    public function getMinimumShouldMatch(): string;

    /**
     * Retrieve Tie Breaker value.
     */
    public function getTieBreaker(): float;

    /**
     * Retrieve phrase match boost.
     */
    public function getPhraseMatchBoost(): int|false;

    /**
     * Retrieve Cut-off Frequency.
     */
    public function getCutOffFrequency(): float;

    /**
     * Check if fuzziness is enabled.
     */
    public function isFuzzinessEnabled(): bool;

    /**
     * Check if phonetic search is enabled.
     */
    public function isPhoneticSearchEnabled(): bool;

    /**
     * Retrieve Fuzziness configuration.
     */
    public function getFuzzinessConfiguration(): ?FuzzinessConfigurationInterface;
}
