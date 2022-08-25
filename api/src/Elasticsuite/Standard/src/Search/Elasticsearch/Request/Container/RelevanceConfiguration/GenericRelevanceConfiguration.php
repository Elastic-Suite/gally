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

namespace Elasticsuite\Search\Elasticsearch\Request\Container\RelevanceConfiguration;

use Elasticsuite\Search\Elasticsearch\Request\Container\RelevanceConfigurationInterface;

class GenericRelevanceConfiguration implements RelevanceConfigurationInterface
{
    private FuzzinessConfigurationInterface $fuzzinessConfiguration;

    public function __construct()
    {
        $this->fuzzinessConfiguration = new FuzzinessConfig('AUTO', 1, 10);
    }

    public function getMinimumShouldMatch(): string
    {
        return '100%';
    }

    public function getTieBreaker(): float
    {
        return 1.0;
    }

    public function getPhraseMatchBoost(): int|false
    {
        return false;
    }

    public function getCutOffFrequency(): float
    {
        return 0.15;
    }

    public function getFuzzinessConfiguration(): ?FuzzinessConfigurationInterface
    {
        return $this->fuzzinessConfiguration;
    }

    public function isFuzzinessEnabled(): bool
    {
        return true;
    }

    public function isPhoneticSearchEnabled(): bool
    {
        return true;
    }
}
