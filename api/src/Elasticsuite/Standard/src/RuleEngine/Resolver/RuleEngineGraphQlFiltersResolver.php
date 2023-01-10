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

use Elasticsuite\RuleEngine\Model\RuleEngineGraphQlFilters;
use Elasticsuite\RuleEngine\Service\RuleEngineManager;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RuleEngineGraphQlFiltersResolver
{
    public function __construct(
        private RuleEngineManager $ruleEngineManager
    ) {
    }

    /**
     * @param mixed $item
     */
    public function __invoke($item, array $context): RuleEngineGraphQlFilters
    {
        $ruleJson = $context['args']['rule'];
        $rule = json_decode($ruleJson, true);
        if (false === $rule || null === $rule) {
            throw new BadRequestHttpException('JSON rule object cannot be decoded.');
        }

        return $this->ruleEngineManager->getRuleEngineGraphQlFilters($rule);
    }
}
