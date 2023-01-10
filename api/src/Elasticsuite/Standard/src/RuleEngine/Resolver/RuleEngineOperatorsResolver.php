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

namespace Elasticsuite\RuleEngine\Resolver;

use Elasticsuite\RuleEngine\Model\RuleEngineOperators;
use Elasticsuite\RuleEngine\Service\RuleEngineManager;

class RuleEngineOperatorsResolver
{
    public function __construct(
        private RuleEngineManager $ruleEngineManager
    ) {
    }

    /**
     * @param mixed $item
     */
    public function __invoke($item, array $context): RuleEngineOperators
    {
        return $this->ruleEngineManager->getRuleEngineOperators();
    }
}
