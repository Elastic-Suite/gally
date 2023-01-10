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

namespace Gally\Search\Elasticsearch\Request\Container\RelevanceConfiguration;

use Gally\Catalog\Model\LocalizedCatalog;
use Gally\Search\Elasticsearch\Request\Container\RelevanceConfigurationInterface;

class GenericRelevanceConfiguration implements RelevanceConfigurationInterface
{
    protected FuzzinessConfigurationInterface $fuzzinessConfiguration;
    protected string     $minimumShouldMatch = '100%';
    protected float      $tieBreaker = 1.0;
    protected int|false  $phraseMatchBoost = false;
    protected float      $cutOffFrequency = 0.15;
    protected bool       $isFuzzinessEnabled = true;
    protected bool       $isPhoneticSearchEnabled = true;
    protected string|int $fuzzinessValue = FuzzinessConfig::VALUE_AUTO;
    protected int        $fuzzinessPrefixLength = 1;
    protected int        $fuzzinessMaxExpansion = 10;

    public function __construct(
        protected array $relevanceConfig,
    ) {
        $this->initConfigData(null, null);
    }

    public function initConfigData(?LocalizedCatalog $localizedCatalog, ?string $requestType): void
    {
        $localizedCatalogCode = $localizedCatalog?->getCode() ?? 'global';
        $requestType = $requestType ?? 'generic';

        $defaultConfig = $this->relevanceConfig['global']['request_types']['generic'];
        $defaultLocalizedConfig = $this->relevanceConfig[$localizedCatalogCode]['request_types']['generic'] ?? [];
        $defaultConfig = array_replace_recursive($defaultConfig, $defaultLocalizedConfig);

        $config = $this->relevanceConfig[$localizedCatalogCode]['request_types'][$requestType] ?? [];
        $config = array_replace_recursive($defaultConfig, $config);

        $this->minimumShouldMatch = $config['fulltext']['minimumShouldMatch'];
        $this->tieBreaker = $config['fulltext']['tieBreaker'];
        $this->phraseMatchBoost = !$config['phraseMatch']['enabled'] ? false : (int) $config['phraseMatch']['boost'];
        $this->cutOffFrequency = $config['cutOffFrequency']['value'];
        $this->isPhoneticSearchEnabled = $config['phonetic']['enabled'];
        $this->isFuzzinessEnabled = $config['fuzziness']['enabled'];
        $this->fuzzinessValue = $config['fuzziness']['value'];
        $this->fuzzinessPrefixLength = $config['fuzziness']['prefixLength'];
        $this->fuzzinessMaxExpansion = $config['fuzziness']['maxExpansions'];
        $this->fuzzinessConfiguration = new FuzzinessConfig($this->fuzzinessValue, $this->fuzzinessPrefixLength, $this->fuzzinessMaxExpansion);
    }

    public function getMinimumShouldMatch(): string
    {
        return $this->minimumShouldMatch;
    }

    public function getTieBreaker(): float
    {
        return $this->tieBreaker;
    }

    public function getPhraseMatchBoost(): int|false
    {
        return $this->phraseMatchBoost;
    }

    public function getCutOffFrequency(): float
    {
        return $this->cutOffFrequency;
    }

    public function getFuzzinessConfiguration(): ?FuzzinessConfigurationInterface
    {
        return $this->fuzzinessConfiguration;
    }

    public function isFuzzinessEnabled(): bool
    {
        return $this->isFuzzinessEnabled;
    }

    public function isPhoneticSearchEnabled(): bool
    {
        return $this->isPhoneticSearchEnabled;
    }
}
