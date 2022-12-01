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

use Elasticsuite\Exception\LogicException;

/**
 * Fuzziness Configuration object.
 */
class FuzzinessConfig implements FuzzinessConfigurationInterface
{
    public const VALUE_AUTO = 'AUTO';
    public const VALUE_1 = 1;
    public const VALUE_2 = 2;
    public const ALLOWED_VALUES = [self::VALUE_AUTO, self::VALUE_1, self::VALUE_2];

    /**
     * RelevanceConfiguration constructor.
     *
     * @param string|int $value        The fuzziness value
     * @param int        $prefixLength The prefix length
     * @param int        $maxExpansion The max expansion
     */
    public function __construct(
        private string|int $value,
        private int $prefixLength,
        private int $maxExpansion,
    ) {
        if (!\in_array($value, self::ALLOWED_VALUES, true)) {
            throw new LogicException('Allowed values for fuzziness value: "' . implode('", "', self::ALLOWED_VALUES) . '".');
        }
    }

    /**
     * {@inheritDoc}
     */
    public function getValue(): string|int
    {
        return $this->value;
    }

    /**
     * {@inheritDoc}
     */
    public function getPrefixLength(): int
    {
        return $this->prefixLength;
    }

    /**
     * {@inheritDoc}
     */
    public function getMaxExpansion(): int
    {
        return $this->maxExpansion;
    }
}
