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

namespace Gally\RuleEngine\Resolver;

use Gally\RuleEngine\Model\RuleEngineOperators;
use Gally\RuleEngine\Service\RuleEngineManager;

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
