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

use Gally\Exception\LogicException;

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
