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

namespace Gally\Analysis\Service;

use Gally\Cache\Service\CacheManagerInterface;

class Config
{
    public const CACHE_KEY_PREFIX = 'gally_analysis_';
    public const LANGUAGE_DEFAULT = 'default';

    public function __construct(
        private CacheManagerInterface $cache,
        private array $analysisConfiguration,
    ) {
    }

    /**
     * Get analysis configuration for given language.
     */
    public function get(string $language = self::LANGUAGE_DEFAULT): array
    {
        return $this->cache->get(
            self::CACHE_KEY_PREFIX . $language,
            function (&$tags, &$ttl) use ($language) {
                // @codeCoverageIgnoreStart
                $configuration = $this->analysisConfiguration[self::LANGUAGE_DEFAULT] ?? [];

                if (self::LANGUAGE_DEFAULT !== $language) {
                    $languageConf = $this->analysisConfiguration[$language] ?? [];
                    $configuration = [
                        'char_filters' => array_merge($configuration['char_filters'] ?? [], $languageConf['char_filters'] ?? []),
                        'filters' => array_merge($configuration['filters'] ?? [], $languageConf['filters'] ?? []),
                        'analyzers' => array_merge($configuration['analyzers'] ?? [], $languageConf['analyzers'] ?? []),
                        'normalizers' => array_merge($configuration['normalizers'] ?? [], $languageConf['normalizers'] ?? []),
                    ];
                }

                $availableCharFilters = array_keys($configuration['char_filters']);
                $availableFilters = array_keys($configuration['filters']);

                return array_filter([
                    'char_filter' => $this->mergeParameters($configuration['char_filters']),
                    'filter' => $this->mergeParameters($configuration['filters']),
                    'analyzer' => $this->cleanFilters($configuration['analyzers'], $availableCharFilters, $availableFilters),
                    'normalizer' => $this->cleanFilters($configuration['normalizers'], $availableCharFilters, $availableFilters),
                ]);
            // @codeCoverageIgnoreEnd
            },
            ['config']
        );
    }

    /**
     * Move params sub array in root filter data.
     *
     * @codeCoverageIgnore
     */
    private function mergeParameters(array $data): array
    {
        foreach ($data as $filterName => $filterData) {
            $data[$filterName] += $filterData['params'] ?? [];
            unset($data[$filterName]['params']);
        }

        return $data;
    }

    /**
     * Remove non-existent char filters and filters from analyzer data.
     *
     * @codeCoverageIgnore
     */
    private function cleanFilters(array $data, array $validCharFilters, array $validFilters): array
    {
        foreach ($data as $analyzerName => $analyzerData) {
            $data[$analyzerName]['char_filter'] = array_values(array_intersect($analyzerData['char_filter'], $validCharFilters));
            $data[$analyzerName]['filter'] = array_values(array_intersect($analyzerData['filter'], $validFilters));
        }

        return $data;
    }
}
