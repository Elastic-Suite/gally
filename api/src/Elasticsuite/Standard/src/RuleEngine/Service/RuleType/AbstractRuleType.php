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

namespace Elasticsuite\RuleEngine\Service\RuleType;

use Elasticsuite\Exception\LogicException;

class AbstractRuleType
{
    public const RULE_TYPE = 'abstract_rule_type';

    public function getRuleType(): string
    {
        if (self::RULE_TYPE === $this::RULE_TYPE) {
            throw new LogicException(sprintf('The constant RULE_TYPE is not defined in the class %s', static::class));
        }

        return $this::RULE_TYPE;
    }
}
